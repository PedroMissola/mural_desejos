'use server'

import { db } from "@/lib/db";
import { wishSchema } from "@/lib/schema";
import { revalidatePath } from "next/cache";
import { calculateAging } from "@/lib/utils";

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
  // Optimization: Check bounding box only once for the immediate area
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
    const distance = COLLISION_RADIUS * (attempt * 1.5); // Increase radius faster
    let cx = Math.floor(desiredX + Math.cos(angle) * distance);
    let cy = Math.floor(desiredY + Math.sin(angle) * distance);

    cx = Math.max(50, Math.min(cx, CANVAS_WIDTH - 50));
    cy = Math.max(50, Math.min(cy, CANVAS_HEIGHT - 50));

    if (!(await checkCollision(cx, cy))) return { x: cx, y: cy };
  }
  
  // Fallback: Just return original (overlapping is better than crashing)
  return { x: desiredX, y: desiredY };
}

// --- PUBLIC ACTIONS ---

export async function createWish(prevState, formData) {
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
      sql: `INSERT INTO wishes (author, title, description, style_json, pos_x, pos_y, likes) VALUES (?, ?, ?, ?, ?, ?, 0) RETURNING id`,
      args: [author, title, description, JSON.stringify(style), finalPos.x, finalPos.y],
    });

    revalidatePath("/");
    
    // Return vital info for Deep Linking
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
    // Edge optimized query
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


// Busca para o sistema de compartilhamento
export async function searchWishesForShare(formData) {
  const author = formData.get("author");
  const title = formData.get("title");

  try {
    // Busca flexível (LIKE)
    const result = await db.execute({
      sql: `SELECT * FROM wishes WHERE author LIKE ? AND title LIKE ? ORDER BY created_at DESC LIMIT 10`,
      args: [`%${author}%`, `%${title}%`]
    });

    return result.rows.map(row => {
        // Reutiliza a lógica de processamento visual existente
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