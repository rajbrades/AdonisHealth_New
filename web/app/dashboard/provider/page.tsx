"use client"

import { useState, useEffect } from "react"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Search, Plus, FileText, AlertCircle } from "lucide-react"

// Mock Data until API is fully connected with Auth
const mockPatients = [
    { id: "1", name: "John Doe", dob: "1985-04-12", status: "Active", lastLab: "2024-01-10", alert: false },
    { id: "2", name: "Michael Smith", dob: "1978-08-23", status: "Pending Review", lastLab: "2024-01-14", alert: true },
    { id: "3", name: "David Johnson", dob: "1990-11-30", status: "Active", lastLab: "2023-12-05", alert: false },
    { id: "4", name: "Robert Williams", dob: "1982-02-14", status: "New Intake", lastLab: "-", alert: false },
]

export default function ProviderDashboard() {
    const [searchTerm, setSearchTerm] = useState("")

    const filteredPatients = mockPatients.filter(patient =>
        patient.name.toLowerCase().includes(searchTerm.toLowerCase())
    )

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-white">Provider Dashboard</h1>
                    <p className="text-muted-foreground mt-1">Manage your patient panel and reviews.</p>
                </div>
                <Button className="bg-primary text-black hover:bg-primary/90">
                    <Plus className="mr-2 h-4 w-4" /> Add Patient
                </Button>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card className="bg-card/50 border-border/50">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Active Patients</CardTitle>
                        <FileText className="h-4 w-4 text-primary" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">128</div>
                        <p className="text-xs text-muted-foreground">+4% from last month</p>
                    </CardContent>
                </Card>
                <Card className="bg-card/50 border-border/50">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Pending Reviews</CardTitle>
                        <AlertCircle className="h-4 w-4 text-yellow-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-yellow-500">12</div>
                        <p className="text-xs text-muted-foreground">Labs awaiting sign-off</p>
                    </CardContent>
                </Card>
            </div>

            <Card className="border-border/50 bg-black/50 backdrop-blur">
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle>Patient List</CardTitle>
                        <div className="flex w-full max-w-sm items-center space-x-2">
                            <Input
                                placeholder="Search patients..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="bg-background/50"
                            />
                            <Button size="icon" variant="ghost">
                                <Search className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow className="border-border/50 hover:bg-transparent">
                                <TableHead>Name</TableHead>
                                <TableHead>Date of Birth</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Last Lab</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredPatients.map((patient) => (
                                <TableRow key={patient.id} className="border-border/50 hover:bg-muted/50 cursor-pointer">
                                    <TableCell className="font-medium text-white">
                                        {patient.name}
                                        {patient.alert && <span className="ml-2 text-yellow-500 inline-block">●</span>}
                                    </TableCell>
                                    <TableCell>{patient.dob}</TableCell>
                                    <TableCell>
                                        <Badge variant={patient.status === "Pending Review" ? "destructive" : "secondary"}
                                            className={patient.status === "Pending Review" ? "bg-yellow-500/20 text-yellow-500 hover:bg-yellow-500/30" : "bg-primary/20 text-primary hover:bg-primary/30"}>
                                            {patient.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>{patient.lastLab}</TableCell>
                                    <TableCell className="text-right">
                                        <Button variant="ghost" size="sm" className="text-primary hover:text-primary/80">View</Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    )
}
