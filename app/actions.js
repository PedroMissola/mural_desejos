'use server'

import { db } from "@/lib/db";
import { wishSchema } from "@/lib/schema";
import { revalidatePath } from "next/cache";

export async function createWish(prevState, formData) {
  // 1. Extrair os dados brutos
  const rawData = {
    author: formData.get("author"),
    title: formData.get("title"),
    description: formData.get("description"),
    posX: formData.get("posX"), 
    posY: formData.get("posY"),
    style: {
      color: formData.get("style_color"),
      starStyle: formData.get("style_type"),
      size: Number(formData.get("style_size")),
      points: Number(formData.get("style_points")) || 5,
      animation: formData.get("style_animation"),
    }
  };

  // 2. Validar
  const validated = wishSchema.safeParse(rawData);

  if (!validated.success) {
    return {
      success: false,
      errors: validated.error.flatten().fieldErrors,
      message: "Verifique os erros abaixo.",
      inputs: rawData // <--- DEVOLVEMOS OS DADOS PARA NÃO PERDER O QUE FOI DIGITADO
    };
  }

  const { author, title, description, style, posX, posY } = validated.data;

  try {
    await db.execute({
      sql: `
        INSERT INTO wishes (author, title, description, style_json, pos_x, pos_y)
        VALUES (?, ?, ?, ?, ?, ?)
      `,
      args: [
        author, 
        title, 
        description, 
        JSON.stringify(style), 
        posX, 
        posY
      ],
    });

    revalidatePath("/");

    return { 
        success: true, 
        message: "Desejo enviado às estrelas!",
        // Não retornamos 'inputs' aqui se quiser limpar, ou retornamos se quiser manter.
        // O useEffect no frontend vai decidir se fecha ou não.
    };

  } catch (error) {
    console.error("Erro ao salvar no Turso:", error);
    return { 
        success: false, 
        message: "Erro de conexão. Tente novamente.",
        inputs: rawData // Mantém os dados em caso de erro de servidor
    };
  }
}