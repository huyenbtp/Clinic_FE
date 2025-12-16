export interface Staff {
	staffId: number;
	fullName: string;
	dateOfBirth: string;
	gender: string;
	email: string;
	phone: string;
	idCard: string;
	address: string;
	role: "DOCTOR" | "RECEPTIONIST" | "WAREHOUSE_STAFF";
	specialization?: string; // Chỉ dành cho bác sĩ
	hireDate: string;
	active: boolean;
}

export interface StaffCreateDto {
	fullName: string;
	dateOfBirth: string;
	gender: string;
	email: string;
	phone: string;
	idCard: string;
	address: string;
	role: string;
	specialization?: string;
	hireDate: string;
	active: boolean;
}

export interface StaffSchedule {
	scheduleId: number;
	staffId: number;
	dayOfWeek: string; // "MONDAY", "TUESDAY", etc.
	startTime: string; // "08:00"
	endTime: string; // "17:00"
	active: boolean;
}
