import { Chip, Typography } from "@mui/material";
import React from "react";

type BadgeType = "chronic" | "contagious";

interface Props {
   value: boolean;
   type: BadgeType;
   size?: "small" | "medium";
}

const BooleanBadge: React.FC<Props> = ({ value, type, size = "small" }) => {
   if (value) {
      if (type === "contagious") {
         return (
            <Chip
               label="Yes"
               size={size}
               sx={{
                  bgcolor: "var(--color-bg-error)",
                  color: "var(--color-text-error)",
                  fontWeight: 500,
               }}
            />
         );
      }

      // chronic
      return (
         <Chip
            label="Yes"
            size={size}
            sx={{
               bgcolor: "var(--color-bg-warning)",
               color: "var(--color-text-warning)",
               fontWeight: 500,
            }}
         />
      );
   }

   // value === false -> neutral outlined chip
   return (
      <Chip
         label={<Typography color="text.secondary">No</Typography>}
         variant="outlined"
         size={size}
         sx={{ borderColor: "var(--color-text-secondary)" }}
      />
   );
};

export default BooleanBadge;
