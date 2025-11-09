"use client";
import React from "react";
import { APPOINTMENT_STATUS_LABEL, APPOINTMENT_STATUS_STYLE, AppointmentStatus } from "@/types/appointment";

type Props = {
  status: AppointmentStatus;
  className?: string;
};

export default function AppointmentStatusBadge({ status, className = "" }: Props) {
  const base = "inline-flex items-center px-2.5 py-0.5 rounded text-xs font-medium";
  const style = APPOINTMENT_STATUS_STYLE[status];
  const label = APPOINTMENT_STATUS_LABEL[status];
  return <span className={`${base} ${style} ${className}`}>{label}</span>;
}
