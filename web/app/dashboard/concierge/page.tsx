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
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, UserPlus, DollarSign, FileText, CheckCircle, ArrowRight } from "lucide-react"
import { getPatients, PatientListItem } from "@/lib/api"
import Link from "next/link"
import { format } from "date-fns"

export default function ConciergeDashboard() {
    const [activeTab, setActiveTab] = useState("intake")
    const [patients, setPatients] = useState<PatientListItem[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchPatients = async () => {
            const data = await getPatients()
            setPatients(data)
            setLoading(false)
        }
        fetchPatients()
    }, [])

    const getStatus = (p: PatientListItem) => {
        const latestNote = p.clinicalNotes?.[0]
        if (!latestNote) return { label: "Ready for Intake", color: "text-muted-foreground" }
        if (latestNote.status === "DRAFT") return { label: "Drafting", color: "text-yellow-500" }
        return { label: "Intake Complete", color: "text-green-500" }
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-white">Concierge Portal</h1>
                    <p className="text-muted-foreground mt-1">Manage patient intake, quotes, and billing.</p>
                </div>
                <div className="flex gap-2">
                    <Button className="bg-primary text-black hover:bg-primary/90">
                        <UserPlus className="mr-2 h-4 w-4" /> New Patient Intake
                    </Button>
                    <Button variant="outline" className="text-foreground hover:text-primary hover:bg-transparent">
                        <DollarSign className="mr-2 h-4 w-4" /> Create Quote
                    </Button>
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
                <Card className="bg-card/50 border-border/50">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">New Intakes (All Time)</CardTitle>
                        <UserPlus className="h-4 w-4 text-primary" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{patients.length}</div>
                        <p className="text-xs text-muted-foreground">Total registered patients</p>
                    </CardContent>
                </Card>
                <Card className="bg-card/50 border-border/50">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Pending Quotes</CardTitle>
                        <FileText className="h-4 w-4 text-yellow-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-yellow-500">5</div>
                        <p className="text-xs text-muted-foreground">$4,250.00 potential value</p>
                    </CardContent>
                </Card>
                <Card className="bg-card/50 border-border/50">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Invoices Paid</CardTitle>
                        <CheckCircle className="h-4 w-4 text-green-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-500">18</div>
                        <p className="text-xs text-muted-foreground">Last 24 hours</p>
                    </CardContent>
                </Card>
            </div>

            <Tabs defaultValue="intake" className="w-full" onValueChange={setActiveTab}>
                <TabsList className="bg-muted/50">
                    <TabsTrigger value="intake">Intake Queue</TabsTrigger>
                    <TabsTrigger value="quotes">Active Quotes</TabsTrigger>
                </TabsList>

                <TabsContent value="intake" className="mt-4">
                    <Card className="border-border/50 bg-black/50 backdrop-blur">
                        <CardHeader>
                            <CardTitle>Recent Sign-Ups</CardTitle>
                            <CardDescription>Patients needing initial lifestyle assessment.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow className="border-border/50 hover:bg-transparent">
                                        <TableHead>Patient Name</TableHead>
                                        <TableHead>Registered</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead className="text-right">Action</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {loading ? (
                                        <TableRow>
                                            <TableCell colSpan={4} className="text-center">Loading...</TableCell>
                                        </TableRow>
                                    ) : patients.map((patient) => {
                                        const status = getStatus(patient)
                                        return (
                                            <TableRow key={patient.id} className="border-border/50 hover:bg-muted/50">
                                                <TableCell className="font-medium text-white">{patient.firstName} {patient.lastName}</TableCell>
                                                <TableCell>{patient.user?.createdAt ? format(new Date(patient.user.createdAt), "MMM d, h:mm a") : "N/A"}</TableCell>
                                                <TableCell className={status.color}>{status.label}</TableCell>
                                                <TableCell className="text-right">
                                                    <Link href={`/dashboard/provider/patient/${patient.id}`}>
                                                        <Button size="sm" variant="secondary" className="bg-primary/10 text-primary hover:bg-primary/20">
                                                            View Profile <ArrowRight className="ml-2 h-3 w-3" />
                                                        </Button>
                                                    </Link>
                                                </TableCell>
                                            </TableRow>
                                        )
                                    })}
                                    {!loading && patients.length === 0 && (
                                        <TableRow>
                                            <TableCell colSpan={4} className="text-center text-muted-foreground">No patients found</TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="quotes" className="mt-4">
                    <Card className="border-border/50 bg-black/50 backdrop-blur">
                        <CardHeader>
                            <CardTitle>Quotes Awaiting Approval</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow className="border-border/50 hover:bg-transparent">
                                        <TableHead>Patient</TableHead>
                                        <TableHead>Items</TableHead>
                                        <TableHead>Total</TableHead>
                                        <TableHead>Valid Until</TableHead>
                                        <TableHead className="text-right">Status</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    <TableRow className="border-border/50 hover:bg-muted/50">
                                        <TableCell className="font-medium text-white">Michael Smith</TableCell>
                                        <TableCell>TRT Protocol + DHEA</TableCell>
                                        <TableCell>$245.00</TableCell>
                                        <TableCell>Jan 30, 2026</TableCell>
                                        <TableCell className="text-right text-yellow-500">Pending</TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
}
