import { Avatar, Box, Button, Card, Divider, Typography } from "@mui/material";
import dayjs from "dayjs";
import { Calendar, IdCard, UserRoundCog } from "lucide-react";

const request = {
    name: "James Allaire",
    postedDate: '2025-10-16T10:00:00',
    role: "Doctor",
    staff_id: "STAFF001",
    off_days: [
        '2025-10-24T00:00:00',
        '2025-10-25T00:00:00',
        '2025-10-26T00:00:00',
        '2025-10-27T00:00:00',
    ],
    start_off_time: '2025-10-24T00:00:00',
    end_off_time: '2025-10-27T00:00:00',
    reason: "Xin nghỉ phép về quê",
}

export default function LeaveRequests() {
    return (
        <Card sx={{
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            m: '6px',
            padding: '18px 30px',
            borderRadius: 2,
            boxShadow: "0px 3px 6px rgba(0, 0, 0, 0.031)",
        }}>
            <Box sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                mb: 1.5
            }}>
                <Typography sx={{ fontSize: '22px', fontWeight: 'bold', }}>
                    Leave Requests
                </Typography>

                <Box sx={{
                    display: 'flex',
                    padding: '2px 10px',
                    border: '1px solid #ddd',
                    borderRadius: 2,
                }}>
                    <Typography sx={{ fontSize: '14px', fontWeight: 'bold' }}>
                        3 total
                    </Typography>
                </Box>
            </Box>
            <Divider />

            <Box sx={{
                my: 2.5,
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                bgcolor: '#f5faff',
                border: '1px solid var(--color-border)',
                padding: '18px',
                borderRadius: 1,
                gap: 2,
                overflowY: 'auto',
            }}>
                <Box display="flex" gap={2}>
                    <Avatar />
                    <Box>
                        <Typography fontWeight="bold" fontSize={14}>
                            {request.name}
                        </Typography>
                        <Typography fontSize={13} color="var(--color-text-secondary)">
                            Posted on {dayjs(request.postedDate).format("DD/MM/YYYY")}
                        </Typography>
                    </Box>
                </Box>

                <Box display="flex" gap={2}>
                    <UserRoundCog color="var(--color-primary-main)" />
                    <Typography fontSize={14}>
                        <b>Role:</b> {request.role}
                    </Typography>
                </Box>

                <Box display="flex" gap={2}>
                    <IdCard color="var(--color-primary-main)" />
                    <Typography fontSize={14}>
                        <b>Staff ID:</b> {request.staff_id}
                    </Typography>
                </Box>

                <Box display="flex" gap={2}>
                    <Calendar color="var(--color-primary-main)" />
                    <Typography fontSize={14}>
                        <b>Time off:</b>
                    </Typography>
                </Box>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, ml: 5, mb: 1 }}>
                    {request.off_days.map(day => (
                        <Box sx={{
                            display: 'flex',
                            p: '1px 10px',
                            border: '1px solid var(--color-border)',
                            borderRadius: 10,
                            bgcolor: 'var(--color-bg-tag)'
                        }}>
                            <Typography fontSize={14}>
                                <b>
                                    {dayjs(day).format("DD/MM/YYYY")}
                                </b>
                            </Typography>
                        </Box>
                    ))}
                </Box>

                <Box display="flex" gap={2}>
                    <Typography fontSize={14}>
                        <b>Reason:</b> {request.reason}
                    </Typography>
                </Box>
            </Box>

            <Button variant="contained" sx={{
                mt: 'auto',
                textTransform: 'none'
            }}>
                View all requests
            </Button>
            {/* 
            <Box sx={{
                mt: 1,
                display: 'flex',
                justifyContent: "space-between",
                alignItems: "center",
                padding: '18px',
                borderRadius: 1,
            }}>
                <Box display="flex" gap={2}>
                    <Avatar />
                    <Box>
                        <Typography fontWeight="bold" fontSize={14}>
                            James Allaire
                        </Typography>
                        <Typography fontSize={13} color="var(--color-text-secondary)">
                            4 Days - Personal Reason
                        </Typography>
                    </Box>
                </Box>
                <Box display="flex" gap={1}>
                    <IconButton sx={{
                        bgcolor: "var(--color-bg-error)",
                    }}>
                        <Close sx={{ color: "var(--color-text-error)" }} />
                    </IconButton>
                    <IconButton sx={{
                        bgcolor: "var(--color-bg-success)",
                    }}>
                        <Check color="var(--color-text-success)" />
                    </IconButton>
                </Box>
            </Box>
            */}
        </Card>
    )
}