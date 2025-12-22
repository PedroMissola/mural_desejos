import { z } from "zod";

const styleSchema = z.object({
  color: z.enum(["blue", "red", "white", "green", "yellow"]),
  starStyle: z.enum(["circle", "star"]),
  size: z.number().min(10).max(100),
  points: z.number().int().min(4).max(12).optional(),
  animation: z.enum(["pulse", "bounce", "spin", "shimmer"]),
});

export const wishSchema = z.object({
  author: z.string().min(2, "Nome muito curto").max(50, "Nome muito longo"),
  title: z.string().min(3, "Título muito curto").max(100),
  description: z.string().max(500).optional(),
  
  style: styleSchema,

  posX: z.coerce.number().int().nonnegative("A posição X não pode ser negativa"),
  posY: z.coerce.number().int().nonnegative("A posição Y não pode ser negativa"),
});