'use server'

import { db } from "@/lib/db";
import { wishSchema } from "@/lib/schema";
import { revalidatePath } from "next/cache";
import { calculateAging } from "@/lib/utils";
import { headers, cookies } from "next/headers"; // Adicionado cookies

const CANVAS_WIDTH = 4000;
const CANVAS_HEIGHT = 3000;
const COLLISION_RADIUS = 20;
const MAX_ATTEMPTS = 15;

// --- PROCESSOR ---
function processRow(row) {
    let parsedStyle;
    try { parsedStyle = JSON.parse(row.style_json); } 
    catch (e) { parsedStyle = { color: "white", starStyle: "star", size: 8, animation: "pulse" }; }

    const { opacity, currentSize } = calculateAging(row.created_at, parsedStyle.size);

    return {
      id: row.id,
      author: row.author || "Anônimo",
      title: row.title || "Sem título",
      description: row.description,
      likes: row.likes || 0,
      style: { ...parsedStyle, size: currentSize, opacity }, 
      x: Number(row.pos_x),
      y: Number(row.pos_y),
      date: row.created_at
    };
}

// --- COLLISION SYSTEM ---
async function findSmartPosition(desiredX, desiredY) {
  const boundary = COLLISION_RADIUS * 2;
  
  const checkCollision = async (x, y) => {
    try {
      const result = await db.execute({
        sql: `SELECT id FROM wishes WHERE pos_x BETWEEN ? AND ? AND pos_y BETWEEN ? AND ? LIMIT 1`,
        args: [x - COLLISION_RADIUS, x + COLLISION_RADIUS, y - COLLISION_RADIUS, y + COLLISION_RADIUS]
      });
      return result.rows.length > 0;
    } catch { return false; }
  }

  if (!(await checkCollision(desiredX, desiredY))) return { x: desiredX, y: desiredY };

  // Spiral Algorithm
  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    const angle = Math.random() * Math.PI * 2;
    const distance = COLLISION_RADIUS * (attempt * 1.5); 
    let cx = Math.floor(desiredX + Math.cos(angle) * distance);
    let cy = Math.floor(desiredY + Math.sin(angle) * distance);

    cx = Math.max(50, Math.min(cx, CANVAS_WIDTH - 50));
    cy = Math.max(50, Math.min(cy, CANVAS_HEIGHT - 50));

    if (!(await checkCollision(cx, cy))) return { x: cx, y: cy };
  }
  
  return { x: desiredX, y: desiredY };
}

// --- PUBLIC ACTIONS ---

export async function createWish(prevState, formData) {
  // CORREÇÃO: await headers() e await cookies()
  const headersList = await headers(); 
  const cookieStore = await cookies();
  /*
  const ip = headersList.get("x-forwarded-for")?.split(',')[0] || "127.0.0.1";

  // 1. CAMADA DE SEGURANÇA (SOFT): Cookies
  // Verifica se o navegador tem o cookie de "já postou hoje"
  if (cookieStore.get("wish_cooldown")) {
    return { 
      success: false, 
      message: "Você já fez um desejo hoje. Volte amanhã!" 
    };
  }

  // 2. CAMADA DE SEGURANÇA (HARD): Banco de Dados por IP
  try {
    const existingWish = await db.execute({
      sql: `SELECT id FROM wishes WHERE user_ip = ? AND created_at > datetime('now', '-1 day') LIMIT 1`,
      args: [ip]
    });

    if (existingWish.rows.length > 0) {
      return { 
        success: false, 
        message: "As estrelas pedem paciência. Apenas um desejo por dia é permitido neste local." 
      };
    }
  } catch (error) {
    console.error("Erro ao verificar IP:", error);
  }
*/
  // --- VALIDAÇÃO E CRIAÇÃO ---
  const rawSize = Number(formData.get("style_size")) || 50;
  const pixelSize = Math.round(4 + (rawSize / 100) * 12);

  const rawData = {
    author: formData.get("author"),
    title: formData.get("title"),
    description: formData.get("description"),
    posX: formData.get("posX"), 
    posY: formData.get("posY"),
    style: {
      color: formData.get("style_color"),
      starStyle: formData.get("style_type"),
      size: pixelSize, 
      points: Number(formData.get("style_points")) || 5,
      animation: formData.get("style_animation"),
    }
  };

  const validated = wishSchema.safeParse(rawData);

  if (!validated.success) {
    return { success: false, errors: validated.error.flatten().fieldErrors, message: "Dados inválidos." };
  }

  const { author, title, description, style, posX, posY } = validated.data;

  try {
    const finalPos = await findSmartPosition(posX, posY);

    const result = await db.execute({
      sql: `INSERT INTO wishes (author, title, description, style_json, pos_x, pos_y, likes, user_ip) VALUES (?, ?, ?, ?, ?, ?, 0, ?) RETURNING id`,
      args: [author, title, description, JSON.stringify(style), finalPos.x, finalPos.y, ip],
    });
    
    // SUCESSO: Define o Cookie para bloquear novas tentativas pelo navegador por 24h
    cookieStore.set("wish_cooldown", "true", { maxAge: 60 * 60 * 24 }); // 24 horas

    revalidatePath("/");
    
    return { 
      success: true, 
      message: "Estrela criada com sucesso!", 
      wishId: result.rows[0]?.id,
      coordinates: finalPos 
    };

  } catch (error) {
    console.error("DB Error:", error);
    return { success: false, message: "Erro ao conectar com o céu.", inputs: rawData };
  }
}

export async function getWishes(page = 1, limit = 100) {
  try {
    const offset = (page - 1) * limit;
    const result = await db.execute({
      sql: `SELECT * FROM wishes ORDER BY created_at DESC LIMIT ? OFFSET ?`,
      args: [limit, offset]
    });
    return result.rows.map(processRow);
  } catch (e) { return []; }
}

export async function getWishById(id) {
  if(!id) return null;
  try {
    const result = await db.execute({ sql: `SELECT * FROM wishes WHERE id = ?`, args: [id] });
    if (result.rows.length === 0) return null;
    return processRow(result.rows[0]);
  } catch (e) { return null; }
}

export async function searchWishesForShare(formData) {
  const author = formData.get("author");
  const title = formData.get("title");

  try {
    const result = await db.execute({
      sql: `SELECT * FROM wishes WHERE author LIKE ? AND title LIKE ? ORDER BY created_at DESC LIMIT 10`,
      args: [`%${author}%`, `%${title}%`]
    });

    return result.rows.map(row => {
        let parsedStyle;
        try { parsedStyle = JSON.parse(row.style_json); } 
        catch (e) { parsedStyle = { color: "white", starStyle: "star", size: 8 }; }
        
        return {
          id: row.id,
          author: row.author,
          title: row.title,
          description: row.description,
          x: Number(row.pos_x),
          y: Number(row.pos_y),
          style: parsedStyle
        };
    });
  } catch (e) {
    console.error(e);
    return [];
  }
}