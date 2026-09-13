export interface Book {
  id: string;
  isbn: string;
  title: string;
  author: string;
  publisher: string;
  category: string;
  edition: string;
  totalCopies: number;
  availableCopies: number;
  rackLocation: string;
  coverUrl?: string;
}

export interface BookTransaction {
  id: string;
  bookId: string;
  bookTitle: string;
  borrowerType: 'student' | 'staff';
  borrowerId: string;
  borrowerName: string;
  classSection?: string;
  issueDate: string;
  dueDate: string;
  returnDate?: string;
  fineAmount: number; // in ₹ INR
  status: 'issued' | 'returned' | 'overdue' | 'renewed';
}

export interface InventoryItem {
  id: string;
  code: string;
  name: string;
  category: 'Stationery' | 'Classroom' | 'Laboratory' | 'Sports' | 'Uniforms' | 'IT Equipment' | 'Furniture';
  quantityInStock: number;
  minThreshold: number;
  unit: string;
  unitPrice: number;
  location: string;
  supplierName: string;
  lastRestockedDate: string;
}

export interface TransportRoute {
  id: string;
  routeNumber: string; // "Route 04"
  name: string; // "North Delhi Express"
  busNumber: string; // "DL-01-AB-1234"
  driverId: string;
  driverName: string;
  driverPhone: string;
  attendantName: string;
  totalCapacity: number;
  assignedStudentsCount: number;
  status: 'Idle' | 'En Route' | 'Completed' | 'Delayed';
  currentStop?: string;
  stops: {
    order: number;
    stopName: string;
    pickupTime: string;
    dropTime: string;
    studentCount: number;
  }[];
}

export interface StudentTransportAllocation {
  id: string;
  studentId: string;
  studentName: string;
  classSection: string;
  routeId: string;
  stopName: string;
  pickupTime: string;
  dropTime: string;
  pickupStatus: 'Waiting' | 'Picked Up' | 'Dropped' | 'Absent';
}
