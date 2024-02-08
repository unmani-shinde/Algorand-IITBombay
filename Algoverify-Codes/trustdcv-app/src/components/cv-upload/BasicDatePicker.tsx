import React, { useState } from "react";
import dayjs from "dayjs";
import { DemoContainer, DemoItem } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { MobileDatePicker } from "@mui/x-date-pickers/MobileDatePicker";
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";
import { StaticDatePicker } from "@mui/x-date-pickers/StaticDatePicker";
import InputGroup from "react-bootstrap/InputGroup";

export interface ResponsiveDatePickersProps {
  onChange: (value: any) => void;
}
export default function ResponsiveDatePickers(
  props: ResponsiveDatePickersProps
) {
  const [startDate, setStartDate] = useState(new Date("DD/MM/YYYY"));

  const [endDate, setEndDate] = useState(new Date("DD/MM/YYYY"));

  const handleDataChange = (newValue: any) => {
    setStartDate(newValue);
    console.log(formatDateTime(newValue.toDate()));
    props.onChange({
      startDate: formatDateTime(newValue.toDate()),
      type: 1,
    });
    console.log(newValue.toString());
  };

  const handleData2Change = (newValue: any) => {
    setEndDate(newValue);
    props.onChange({
      endDate: formatDateTime(newValue.toDate()),
      type: 2,
    });
    console.log(newValue.toDate());
  };

  // 中国标准时间 转换成 年月日
  const formatDateTime = (date: Date) => {
    let y = date.getFullYear();
    let m: any = date.getMonth() + 1;
    m = m < 10 ? "0" + m : m;
    let d: any = date.getDate();
    d = d < 10 ? "0" + d : d;
    let h = date.getHours();
    let minute: any = date.getMinutes();
    minute = minute < 10 ? "0" + minute : minute;
    // return y + '-' + m + '-' + d+' '+h+':'+minute;
    return y + "-" + m + "-" + d;
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <InputGroup
        className="mb-3 gap-3"
        size="lg"
        // components={
        //   [
        //     "DatePicker",
        //     "MobileDatePicker",
        //     "DesktopDatePicker",
        //     "StaticDatePicker",
        //   ] as any
        // }
      >
        <DemoItem label="Start Date">
          <DesktopDatePicker
            value={startDate}
            defaultValue={dayjs("DD/MM/YYYY")}
            // clearable
            // inputFormat="DD/MM/YYYY"
            onChange={handleDataChange}
          />
        </DemoItem>
        <DemoItem label="End Date">
          <DesktopDatePicker
            value={endDate}
            defaultValue={dayjs("DD/MM/YYYY")}
            // clearable
            // inputFormat="DD/MM/YYYY"
            onChange={handleData2Change}
          />
        </DemoItem>
      </InputGroup>
    </LocalizationProvider>
  );
}
