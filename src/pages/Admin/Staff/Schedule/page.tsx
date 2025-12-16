import { useEffect, useState } from "react";
import {
   Box,
   Button,
   Card,
   Typography,
   Table,
   TableBody,
   TableCell,
   TableHead,
   TableRow,
   TablePagination,
   Chip,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { ChevronLeft } from "@mui/icons-material";
import { showMessage } from "../../../../components/ActionResultMessage";
import { apiCall } from "../../../../api/api";
import { staffGetById, staffScheduleGetByStaffId } from "../../../../api/urls";

interface StaffSchedule {
   scheduleId: number;
   dayOfWeek: string;
   startTime: string;
   endTime: string;
   active: boolean;
}

interface StaffInfo {
   staffId: number;
   fullName: string;
   role: string;
}

const daysOfWeek: any = {
   MONDAY: "Monday",
   TUESDAY: "Tuesday",
   WEDNESDAY: "Wednesday",
   THURSDAY: "Thursday",
   FRIDAY: "Friday",
   SATURDAY: "Saturday",
   SUNDAY: "Sunday",
};

const dayOrder = [
   "MONDAY",
   "TUESDAY",
   "WEDNESDAY",
   "THURSDAY",
   "FRIDAY",
   "SATURDAY",
   "SUNDAY",
];

function getRoleLabel(role: string) {
   const labels: any = {
      DOCTOR: "Doctor",
      RECEPTIONIST: "Receptionist",
      WAREHOUSE_STAFF: "Warehouse Staff",
   };
   return labels[role] || role;
}

export default function StaffSchedule() {
   const { id } = useParams();
   const navigate = useNavigate();
   const [staffInfo, setStaffInfo] = useState<StaffInfo | null>(null);
   const [schedules, setSchedules] = useState<StaffSchedule[]>([]);
   const [loading, setLoading] = useState(true);
   const [page, setPage] = useState(0);
   const [rowsPerPage, setRowsPerPage] = useState(10);

   const formatDateDDMMYYYY = (dateStr: any) => {
      if (!dateStr) return "";
      const dt = new Date(dateStr);
      if (isNaN(dt.getTime())) return String(dateStr);
      const dd = String(dt.getDate()).padStart(2, "0");
      const mm = String(dt.getMonth() + 1).padStart(2, "0");
      const yyyy = dt.getFullYear();
      return `${dd}/${mm}/${yyyy}`;
   };

   useEffect(() => {
      if (!id) return;

      const token = localStorage.getItem("accessToken");

      // Fetch staff info
      apiCall(
         staffGetById(Number(id)),
         "GET",
         token,
         null,
         (res: any) => {
            setStaffInfo(res.data || null);
         },
         (err: any) => {
            console.error(err);
            showMessage("Cannot load staff information", "error");
         }
      );

      // Fetch schedules
      apiCall(
         staffScheduleGetByStaffId(Number(id)),
         "GET",
         token,
         null,
         (res: any) => {
            const data = res.data || [];
            // Helper to compute a numeric day index (0=MONDAY..6=SUNDAY)
            const getDayIndex = (s: any) => {
               const dayOrderMap: any = {
                  MONDAY: 0,
                  TUESDAY: 1,
                  WEDNESDAY: 2,
                  THURSDAY: 3,
                  FRIDAY: 4,
                  SATURDAY: 5,
                  SUNDAY: 6,
               };

               // prefer explicit dayOfWeek
               if (s?.dayOfWeek) {
                  const d = String(s.dayOfWeek).toUpperCase();
                  if (d in dayOrderMap) return dayOrderMap[d];
               }

               // fallback to scheduleDate / schedule_date / scheduleDate
               const dateStr = s?.scheduleDate || s?.schedule_date || s?.schedule_date_string || s?.schedule_date_str;
               if (dateStr) {
                  const dt = new Date(dateStr);
                  if (!isNaN(dt.getTime())) {
                     // JS getDay: 0=Sunday .. 6=Saturday. We convert to MON..SUN index where Monday=0.
                     const jsDay = dt.getDay();
                     return jsDay === 0 ? 6 : jsDay - 1; // Sunday->6, Monday->0
                  }
               }

               return 99; // unknown -> push to end
            };

            // Sort schedules by computed day index
            const sortedData = data.sort((a: any, b: any) => getDayIndex(a) - getDayIndex(b));

            // Merge contiguous slots per computed day key (prefer date string if available)
            // (Status column removed — handled in a different module)
            const timeToMinutes = (t: string) => {
               if (!t) return NaN;
               const parts = String(t).split(":");
               const hh = Number(parts[0] || 0);
               const mm = Number(parts[1] || 0);
               return hh * 60 + mm;
            };

            const getDayKey = (s: any) => {
               const dateStr = s?.scheduleDate || s?.schedule_date || s?.schedule_date_string || s?.schedule_date_str;
               if (dateStr) return String(dateStr);
               return String(s?.dayOfWeek || s?.scheduleDay || s?.schedule_day || "").toUpperCase();
            };

            const merged: any[] = [];
            for (const item of sortedData) {
               const key = getDayKey(item);
               // try to merge with last if same key and contiguous
               const last = merged.length ? merged[merged.length - 1] : null;
               const itemStart = timeToMinutes(item.startTime);
               const itemEnd = timeToMinutes(item.endTime);

               if (
                  last &&
                  getDayKey(last) === key &&
                  !isNaN(itemStart) &&
                  !isNaN(timeToMinutes(last.endTime)) &&
                  timeToMinutes(last.endTime) === itemStart
               ) {
                  // extend last.endTime to item.endTime
                  last.endTime = item.endTime;
               } else {
                  // push shallow copy
                  merged.push({ ...item });
               }
            }

            setSchedules(merged);
            setLoading(false);
         },
         (err: any) => {
            console.error(err);
            showMessage("Cannot load schedule", "error");
            setLoading(false);
         }
      );
   }, [id]);

   if (loading) {
      return (
         <Box p={4} display="flex" justifyContent="center" alignItems="center">
            <Typography>Loading...</Typography>
         </Box>
      );
   }

   return (
      <Box sx={{ p: 3 }}>
         {/* Header */}
         <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
            <Button
               startIcon={<ChevronLeft />}
               onClick={() => navigate(`/admin/staff/${id}`)}
            >
               Back
            </Button>
            <Typography variant="h5" fontWeight="bold">
               Schedule
            </Typography>
         </Box>

         {/* Staff Info Card */}
         {staffInfo && (
            <Card sx={{ p: 2, mb: 3 }}>
               <Box
                  sx={{
                     display: "flex",
                     alignItems: "center",
                     gap: 2,
                     justifyContent: "space-between",
                  }}
               >
                  <Box>
                     <Typography variant="h6" fontWeight="bold">
                        {staffInfo.fullName}
                     </Typography>
                     <Typography variant="body2" color="text.secondary">
                        {getRoleLabel(staffInfo.role)}
                     </Typography>
                  </Box>
               </Box>
            </Card>
         )}

         {/* Schedule Table */}
         <Card sx={{ p: 2 }}>
            <Typography variant="h6" fontWeight="bold" mb={2}>
               Weekly Schedule
            </Typography>

            {schedules.length > 0 ? (
               <>
                  <Table>
                     <TableHead>
                        <TableRow>
                           <TableCell sx={{ fontWeight: "bold" }}>Day</TableCell>
                           <TableCell sx={{ fontWeight: "bold" }}>Date</TableCell>
                           <TableCell sx={{ fontWeight: "bold" }}>
                              Start Time
                           </TableCell>
                           <TableCell sx={{ fontWeight: "bold" }}>
                              End Time
                           </TableCell>
                           {/* Status column removed; handled by another module */}
                        </TableRow>
                     </TableHead>
                     <TableBody>
                        {schedules.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((schedule) => {
                           // normalize day value: prefer 'dayOfWeek', otherwise try schedule date fields
                           const raw = schedule.dayOfWeek ?? schedule.scheduleDay ?? schedule.schedule_day;
                           let dayLabel = "";
                           if (!raw) {
                              // try date-based fallback
                              const dateStr = schedule.scheduleDate || schedule.schedule_date || schedule.schedule_date_string || schedule.schedule_date_str;
                              if (dateStr) {
                                 const dt = new Date(dateStr);
                                 if (!isNaN(dt.getTime())) {
                                    const weekday = dt.getDay(); // 0=Sun..6=Sat
                                    const names = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
                                    dayLabel = names[weekday];
                                 }
                              }
                           } else {
                              const s = String(raw).toUpperCase();
                              if (daysOfWeek[s]) dayLabel = daysOfWeek[s];
                              else if (/^[1-7]$/.test(s)) {
                                 const num = Number(s);
                                 const ord = ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY", "SUNDAY"];
                                 dayLabel = daysOfWeek[ord[num - 1]] || String(raw);
                              } else {
                                 dayLabel = String(raw).charAt(0).toUpperCase() + String(raw).slice(1).toLowerCase();
                              }
                           }

                           return (
                              <TableRow key={schedule.scheduleId}>
                                 <TableCell>
                                    <Typography fontWeight={500}>{dayLabel}</Typography>
                                 </TableCell>
                                 <TableCell>
                                    {(() => {
                                       const dateStr = schedule.scheduleDate || schedule.schedule_date || schedule.schedule_date_string || schedule.schedule_date_str;
                                       if (!dateStr) return "";
                                       return formatDateDDMMYYYY(dateStr);
                                    })()}
                                 </TableCell>
                                 <TableCell>{schedule.startTime}</TableCell>
                                 <TableCell>{schedule.endTime}</TableCell>
                                 {/* Status removed */}
                              </TableRow>
                           );
                        })}
                     </TableBody>
                  </Table>
                  <TablePagination
                     component="div"
                     count={schedules.length}
                     page={page}
                     onPageChange={(e, newPage) => setPage(newPage)}
                     rowsPerPage={rowsPerPage}
                     onRowsPerPageChange={(e) => { setRowsPerPage(parseInt((e.target as HTMLInputElement).value, 10)); setPage(0); }}
                     rowsPerPageOptions={[5, 10, 25]}
                  />
               </>
            ) : (
               <Box
                  sx={{
                     display: "flex",
                     justifyContent: "center",
                     alignItems: "center",
                     py: 4,
                  }}
               >
                  <Typography variant="body2" color="text.secondary">
                     No schedules available
                  </Typography>
               </Box>
            )}
         </Card>

         {/* Info Note */}
         <Card sx={{ p: 2, mt: 3, backgroundColor: "#f5f5f5" }}>
            <Typography variant="body2" color="text.secondary">
               <strong>Note:</strong> This is a view-only schedule screen. To change schedules, please contact the system administrator.
            </Typography>
         </Card>
      </Box>
   );
}
