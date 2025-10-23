import { Box, Card, Typography } from "@mui/material";
import { People } from "@mui/icons-material";
import { Calendar, DollarSign, Package, TrendingUp } from "lucide-react";
import AppointmentStatistics from "./AppointmentStatistics";
import LeaveRequests from "./LeaveRequests";

export default function AdminDashboard() {
    return (
        <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            padding: '26px 50px',
            height: '100%',
            overflowY: 'auto',
        }}>
            <Box margin="0px 31px 18px 31px" display="flex" gap={1}>
                <Typography sx={{
                    fontWeight: 'bold',
                    fontSize: '24px'
                }}>
                    Welcome,
                </Typography>
                <Typography sx={{
                    color: "var(--color-primary-main)",
                    fontWeight: 'bold',
                    fontSize: '24px'
                }}>
                    Dr. Robert Harry
                </Typography>
            </Box>

            <Box sx={{
                display: 'grid',
                gridTemplateColumns: 'repeat(12, 1fr)',
                gridAutoRows: '170px',
                gap: '12px',
                scrollbarWidth: 'none'
            }}>
                <Card sx={{
                    gridColumn: 'span 3',
                    margin: '6px',
                    display: 'flex',
                    alignItems: "center",
                    justifyContent: 'space-between',
                    paddingX: '24px',
                    borderRadius: 2,
                    boxShadow: "0px 3px 6px rgba(0, 0, 0, 0.031)",
                }}>
                    <Box>
                        <Typography sx={{
                            color: "var(--color-text-secondary)",
                            fontSize: '16px'
                        }}>
                            Today's Appointments
                        </Typography>
                        <Typography sx={{
                            color: "var(--color-text-primary)",
                            fontWeight: 'bold',
                            fontSize: '25px',
                            lineHeight: 1.7
                        }}>
                            24
                        </Typography>
                        <Box display="flex" gap={1}>
                            <TrendingUp size={14} color="var(--color-success-main)" />
                            <Typography sx={{
                                color: "var(--color-success-main)",
                                fontSize: '13px'
                            }}>
                                +8 from yesterday
                            </Typography>
                        </Box>
                    </Box>

                    <Calendar size={30} />
                </Card>

                <Card sx={{
                    gridColumn: 'span 3',
                    margin: '6px',
                    display: 'flex',
                    alignItems: "center",
                    justifyContent: 'space-between',
                    paddingX: '24px',
                    borderRadius: 2,
                    boxShadow: "0px 3px 6px rgba(0, 0, 0, 0.031)",
                }}>
                    <Box>
                        <Typography sx={{
                            color: "var(--color-text-secondary)",
                            fontSize: '16px'
                        }}>
                            Active Staff
                        </Typography>
                        <Typography sx={{
                            color: "var(--color-text-primary)",
                            fontWeight: 'bold',
                            fontSize: '25px',
                            lineHeight: 1.7
                        }}>
                            7
                        </Typography>
                        <Typography sx={{
                            color: "var(--color-text-secondary)",
                            fontSize: '13px'
                        }}>
                            On duty today
                        </Typography>
                    </Box>

                    <People sx={{ fontSize: 30, color: "var(--color-success-main)" }} />
                </Card>

                <Card sx={{
                    gridColumn: 'span 3',
                    margin: '6px',
                    display: 'flex',
                    alignItems: "center",
                    justifyContent: 'space-between',
                    paddingX: '24px',
                    borderRadius: 2,
                    boxShadow: "0px 3px 6px rgba(0, 0, 0, 0.031)",
                }}>
                    <Box>
                        <Typography sx={{
                            color: "var(--color-text-secondary)",
                            fontSize: '16px'
                        }}>
                            Monthly Revenue
                        </Typography>
                        <Typography sx={{
                            color: "var(--color-success-main)",
                            fontWeight: 'bold',
                            fontSize: '25px',
                            lineHeight: 1.7
                        }}>
                            $67.000
                        </Typography>
                        <Box display="flex" gap={1}>
                            <TrendingUp size={14} color="var(--color-success-main)" />
                            <Typography sx={{
                                color: "var(--color-success-main)",
                                fontSize: '13px'
                            }}>
                                +12% this month
                            </Typography>
                        </Box>
                    </Box>

                    <DollarSign size={30} color="var(--color-success-main)" />
                </Card>

                <Card sx={{
                    gridColumn: 'span 3',
                    margin: '6px',
                    display: 'flex',
                    alignItems: "center",
                    justifyContent: 'space-between',
                    paddingX: '24px',
                    borderRadius: 2,
                    boxShadow: "0px 3px 6px rgba(0, 0, 0, 0.031)",
                }}>
                    <Box>
                        <Typography sx={{
                            color: "var(--color-text-secondary)",
                            fontSize: '16px'
                        }}>
                            Low Stock Items
                        </Typography>
                        <Typography sx={{
                            color: "var(--color-text-error)",
                            fontWeight: 'bold',
                            fontSize: '25px',
                            lineHeight: 1.7
                        }}>
                            3
                        </Typography>
                        <Typography sx={{
                            color: "var(--color-text-error)",
                            fontSize: '13px'
                        }}>
                            Need attention
                        </Typography>
                    </Box>

                    <Package size={30} color="var(--color-warning-main)" />
                </Card>

                <Box sx={{
                    gridColumn: 'span 8',
                    gridRow: 'span 3',
                }}>
                    <AppointmentStatistics />
                </Box>

                <Box sx={{
                    gridColumn: 'span 4',
                    gridRow: 'span 3',
                }}>
                    <LeaveRequests />
                </Box>
            </Box>
        </Box>
    )
}
