'use server'
import { turso } from "@/lib/turso";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { checkContent } from "@/lib/moderation";

export async function addWish(formData) {
  const title = formData.get("title");
  const message = formData.get("message");
  const sender = formData.get("sender");
  const customization = formData.get("customization"); // JSON String

  // 1. Moderação
  if (!checkContent(title) || !checkContent(message) || !checkContent(sender)) {
    // Se falhar, você poderia retornar um erro, mas aqui vamos apenas ignorar ou salvar como "Bloqueado"
    // Para simplificar, vamos lançar erro que o frontend captura (ou redirecionar com erro)
    return { error: "Conteúdo impróprio detectado. Por favor, seja gentil." };
  }

  // 2. Posição (Evitando colisão com texto central e vila)
  // X: 5% a 95%
  // Y: 5% a 45% (Céu superior)
  const posX = Math.floor(Math.random() * 90) + 5;
  const posY = Math.floor(Math.random() * 40) + 5; 

  // 3. Salvar
  const result = await turso.execute({
    sql: "INSERT INTO wishes (title, message, sender, pos_x, pos_y, customization) VALUES (?, ?, ?, ?, ?, ?) RETURNING id",
    args: [title, message, sender || "Anônimo", posX, posY, customization],
  });

  const newId = result.rows[0].id;

  revalidatePath("/");
  // Redireciona passando o ID para ativar a animação de Zoom na Home
  redirect(`/?new_wish_id=${newId}&pos_x=${posX}&pos_y=${posY}`);
}

export async function getWishes() {
  const result = await turso.execute("SELECT * FROM wishes ORDER BY created_at DESC");
  return result.rows;
}

'use server'
import { turso } from "@/lib/turso";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { checkContent } from "@/lib/moderation";

// ... (sua função addWish continua igual) ...

export async function getWishes() {
  // 1. O SQL já filtra quem tem mais de 1 ano (SQLite syntax)
  const result = await turso.execute(`
    SELECT * FROM wishes 
    WHERE created_at > date('now', '-1 year') 
    ORDER BY created_at DESC
  `);
  
  const now = new Date();
  const oneMonthMs = 30 * 24 * 60 * 60 * 1000; // 30 dias em ms
  const oneYearMs = 365 * 24 * 60 * 60 * 1000; // 1 ano em ms

  // 2. Processamos cada desejo para adicionar o fator de "Distance"
  const processedWishes = result.rows.map(wish => {
    const createdDate = new Date(wish.created_at); // SQLite guarda em UTC
    const age = now - createdDate;

    // Fator de Decaimento (1.0 = Novo e Brilhante, 0.2 = Velho e Distante)
    let decayFactor = 1.0;

    if (age > oneMonthMs) {
      // Se tem mais de 1 mês, começa a afastar
      // Mapeia a idade (entre 1 mês e 1 ano) para um valor entre 1.0 e 0.3
      const progress = (age - oneMonthMs) / (oneYearMs - oneMonthMs);
      decayFactor = 1.0 - (progress * 0.7); // O mínimo será 0.3 (30% de brilho)
      
      // Garante que não fique negativo nem maior que 1
      decayFactor = Math.max(0.3, Math.min(1.0, decayFactor));
    }

    return {
      ...wish,
      decayFactor // Adicionamos essa propriedade extra para o frontend usar
    };
  });

  return processedWishes;
}