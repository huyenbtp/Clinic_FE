import {
   Box,
   IconButton,
   Table,
   TableBody,
   TableCell,
   TableHead,
   TableRow,
   CircularProgress,
   Pagination,
   Select,
   MenuItem,
   Chip,
} from "@mui/material";
import { DeleteOutline, Edit, Visibility } from "@mui/icons-material";
import type { Medicine } from "../../../../types/Medicine";

interface MedicinesTableProps {
   data: Medicine[];
   loading: boolean;
   page: number;
   rowsPerPage: number;
   totalItems: number;
   onPageChange: (page: number) => void;
   onRowsPerPageChange: (rows: number) => void;
   onView: (id: number) => void;
   onEdit: (id: number) => void;
   onDelete: (id: number) => void;
}

export default function MedicinesTable({
   data,
   loading,
   page,
   rowsPerPage,
   totalItems,
   onPageChange,
   onRowsPerPageChange,
   onView,
   onEdit,
   onDelete,
}: MedicinesTableProps) {
   const totalPages = Math.ceil(totalItems / rowsPerPage);

   return (
      <Box
         sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            minHeight: 500,
         }}
      >
         <Table
            sx={{
               "& .MuiTableCell-root": {
                  padding: "12px 8px",
               },
            }}
         >
            <TableHead>
               <TableRow>
                  <TableCell sx={{ fontWeight: "bold" }}>#</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Medicine Name</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Unit</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Concentration</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Manufacturer</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Stock</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }} align="center">
                     Actions
                  </TableCell>
               </TableRow>
            </TableHead>

            <TableBody>
               {loading ? (
                  <TableRow>
                     <TableCell colSpan={7} align="center">
                        <CircularProgress size={28} sx={{ my: 2 }} />
                     </TableCell>
                  </TableRow>
               ) : data.length > 0 ? (
                  data.map((row, index) => (
                     <TableRow key={row.medicineId} hover>
                        <TableCell sx={{ fontWeight: "bold" }}>
                           {(page - 1) * rowsPerPage + index + 1}
                        </TableCell>
                        <TableCell>{row.medicineName}</TableCell>
                        <TableCell>
                           <Chip label={row.unit} size="small" />
                        </TableCell>
                        <TableCell>{row.concentration || "-"}</TableCell>
                        <TableCell>{row.manufacturer || "-"}</TableCell>
                        <TableCell>
                           <Chip
                              label={row.totalQuantity || 0}
                              size="small"
                              sx={{
                                 bgcolor: (row.totalQuantity || 0) > 0 ? '#dcfce7' : '#fee2e2',
                                 fontWeight: 'bold',
                                 color: (row.totalQuantity || 0) > 0 ? '#16a34a' : '#dc2626'
                              }}
                           />
                        </TableCell>
                        <TableCell align="center">
                           <IconButton
                              onClick={() => onView(row.medicineId)}
                              sx={{
                                 color: "var(--color-info-main)",
                                 border: "1px solid var(--color-info-main)",
                                 borderRadius: 1.2,
                                 height: 32,
                                 width: 32,
                                 mr: 1,
                              }}
                              title="View Detail"
                           >
                              <Visibility sx={{ fontSize: 20 }} />
                           </IconButton>
                           <IconButton
                              onClick={() => onEdit(row.medicineId)}
                              sx={{
                                 color: "var(--color-primary-contrast)",
                                 bgcolor: "var(--color-primary-main)",
                                 borderRadius: 1.2,
                                 height: 32,
                                 width: 32,
                                 mr: 1,
                              }}
                              title="Edit"
                           >
                              <Edit sx={{ fontSize: 20 }} />
                           </IconButton>
                           <IconButton
                              onClick={() => onDelete(row.medicineId)}
                              sx={{
                                 color: "var(--color-text-error)",
                                 border: "1px solid var(--color-text-error)",
                                 borderRadius: 1.2,
                                 height: 32,
                                 width: 32,
                              }}
                              title="Delete"
                           >
                              <DeleteOutline sx={{ fontSize: 20 }} />
                           </IconButton>
                        </TableCell>
                     </TableRow>
                  ))
               ) : (
                  <TableRow>
                     <TableCell colSpan={7} align="center">
                        Không có dữ liệu
                     </TableCell>
                  </TableRow>
               )}
            </TableBody>
         </Table>

         <Box
            sx={{
               display: "flex",
               justifyContent: "space-between",
               alignItems: "center",
               mt: 2,
               px: 2,
            }}
         >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
               <span>Hiển thị</span>
               <Select
                  value={rowsPerPage}
                  onChange={(e) => onRowsPerPageChange(Number(e.target.value))}
                  size="small"
               >
                  <MenuItem value={5}>5</MenuItem>
                  <MenuItem value={10}>10</MenuItem>
                  <MenuItem value={20}>20</MenuItem>
                  <MenuItem value={50}>50</MenuItem>
               </Select>
               <span>dòng</span>
            </Box>

            <Pagination
               count={totalPages}
               page={page}
               onChange={(_, value) => onPageChange(value)}
               color="primary"
               showFirstButton
               showLastButton
            />
         </Box>
      </Box>
   );
}
