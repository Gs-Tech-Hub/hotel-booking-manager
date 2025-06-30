    'use client'
import { useEffect, useState } from "react";
import { Button } from "@/components/ui-elements/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table";
import { strapiService } from "@/utils/dataEndpoint";

interface JobApplication {
    id: number;
    fullName: string;
    email: string;
    phone: string;
    position: string;
    skills: string;
  }

export default function JobApplicationTable() {
  const [jobApplications, setJobApplications] = useState<JobApplication[]>([]);

  useEffect(() => {
    async function fetchJobApplications() {
      try {
        const response = await strapiService.miscEndpoints.getJobApplications(
            {
                "populate": "*",
                "pagination[pageSize]": "50"
            });
        setJobApplications(response);
      } catch (error) {
        console.error("Failed to fetch job applications:", error);
      }
    }
    fetchJobApplications();
  }, []);

  return (
    <div className="rounded-[10px] bg-white shadow-1 dark:bg-gray-dark dark:shadow-card">
      <div className="px-6 py-4 sm:px-7 sm:py-5 xl:px-8.5">
        <h2 className="font-bold">Job Applications</h2>
      </div>

      <Table>
        <TableHeader>
          <TableRow className="border-t text-base [&>th]:h-auto [&>th]:py-3 sm:[&>th]:py-4.5">
            <TableHead>Full Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>Position</TableHead>
            <TableHead>Skills</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {jobApplications.map((application) => (
            <TableRow
              className="text-base font-medium text-dark dark:text-white"
              key={application.id}
            >
              <TableCell className="pl-5 sm:pl-6 xl:pl-7.5">
                {application.fullName}
              </TableCell>
              <TableCell>{application.email}</TableCell>
              <TableCell>{application.phone}</TableCell>
              <TableCell>{application.position}</TableCell>
              <TableCell>{application.skills}</TableCell>
              <TableCell>
                <Button
                  label="View Details"
                  variant={"outlinePrimary"}
                  size={"small"}
                  onClick={() => console.log("View details for:", application.id)}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}