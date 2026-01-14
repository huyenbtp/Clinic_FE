import { Badge, Box, Button, Card, CardContent, CardHeader, Typography } from "@mui/material";
import { AlertTriangle, ExternalLink } from "lucide-react";
import type { LowStockMedicine } from "./page";
import dayjs from "dayjs";

export default function LowStockCard({
  data,
}: {
  data: LowStockMedicine[]
}) {

  const getStockLevelInfo = (stock_quantity: number) => {
    if (stock_quantity <= 10) return { level: "critical", style: "bg-error1 text-error1-foreground" };
    return { level: "low", style: "bg-warning1 text-warning1-foreground" };
  };

  return (
    <Card sx={{
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      borderRadius: 2,
      boxShadow: "0px 3px 6px rgba(0, 0, 0, 0.031)",
    }}>
      <CardContent sx={{ display: 'flex', flexDirection: 'column', p: '24px 32px', gap: 2, }}>
        <Box sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: 'center',
        }}>
          <Box sx={{
            display: "flex",
            alignItems: 'center',
            gap: 2,
          }}>
            <AlertTriangle color="var(--color-text-warning)" />
            Low Stock Medicine
          </Box>

          {data.length > 0 &&
            <Button
              sx={{
                textTransform: 'none',
                gap: 1
              }}
            >
              View All
              <ExternalLink size={18} />
            </Button>
          }
        </Box>

        <Box sx={{
          display: "flex",
          flexDirection: 'column',
          gap: 1,
        }}>
          {data.length > 0 ? data.map((item) => {
            const stockInfo = getStockLevelInfo(item.stockQuantity);

            return (
              <Box
                key={item.medicineId}
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  p: 1.5,
                  border: '1px solid var(--color-border)',
                  borderRadius: 1,
                  gap: 1
                }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    width: '100%',
                    justifyContent: 'space-between',
                  }}
                >
                  <Typography fontWeight="bold">
                    {item.name}
                  </Typography>
                  <Box sx={{

                  }}>
                    {item.stockQuantity} left
                  </Box>
                </Box>
                Last Imported: {dayjs(item.lastImported).format("DD/MM/YYYY")}
              </Box>
            )
          }) : (
            <>

            </>
          )}
        </Box>
      </CardContent>
    </Card>
  )
}