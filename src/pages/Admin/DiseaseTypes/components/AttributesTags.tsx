import { Box, Chip, Typography } from "@mui/material";
import React from "react";

interface Props {
   chronic?: boolean;
   contagious?: boolean;
   size?: "small" | "medium";
}

export default function AttributesTags({ chronic, contagious, size = "small" }: Props) {
   const items: JSX.Element[] = [];

   if (contagious) {
      items.push(
         <Chip
            key="contagious"
            label={size === "small" ? "Contagious" : "🦠 Contagious"}
            size={size}
            sx={{
               bgcolor: "var(--color-bg-error)",
               color: "var(--color-text-error)",
               fontWeight: 600,
            }}
         />
      );
   }

   if (chronic) {
      items.push(
         <Chip
            key="chronic"
            label={size === "small" ? "Chronic" : "⌛ Chronic"}
            size={size}
            sx={{
               bgcolor: "var(--color-bg-warning)",
               color: "var(--color-text-warning)",
               fontWeight: 600,
               ml: contagious ? 1 : 0,
            }}
         />
      );
   }

   if (items.length === 0) {
      return <Typography color="text.secondary">-</Typography>;
   }

   return (
      <Box sx={{ display: "inline-flex", gap: 1, alignItems: "center" }}>{items}</Box>
   );
}
