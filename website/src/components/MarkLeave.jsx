import React, { useState, useEffect } from "react";
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { format, addDays } from "date-fns";
import { Card, CardContent, CardHeader } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { CalendarIcon } from "lucide-react";

import ProfessorNavBar from './professorNavBar';

const MarkLeave = () => {
  const [dateRange, setDateRange] = useState([null, null]);
  const [startDate, endDate] = dateRange;
  const [reason, setReason] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => setSuccessMessage(""), 3000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  const validateForm = () => {
    const newErrors = {};
    if (!startDate) {
      newErrors.dates = "Please select a start date";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setLoading(true);

    const requestData = {
      date: format(startDate, "yyyy-MM-dd"),
      reason,
    };

    if (endDate) {
      requestData.endDate = format(endDate, "yyyy-MM-dd");
    }

    try {
      await axios.post("http://localhost:5000/api/mark-leave", requestData, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setSuccessMessage("Leave marked successfully!");
      setDateRange([null, null]);
      setReason("");
    } catch (err) {
      console.error("Error while marking leave:", err);
      setErrors({
        submit: err.response?.data?.message || "Failed to mark leave.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <ProfessorNavBar />
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <Card className="max-w-lg w-full bg-white shadow-lg rounded-lg p-6">
          <CardHeader className="text-2xl font-bold text-center text-gray-800">
            Mark Your Leave
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* Start Date Field */}
              <div>
                <label className="block font-semibold text-gray-700">Start Date *</label>
                <div className="relative">
                  <DatePicker
                    selected={startDate}
                    onChange={(date) => setDateRange([date, endDate])}
                    minDate={new Date()}
                    maxDate={addDays(new Date(), 60)}
                    placeholderText="Select start date"
                    dateFormat="MMM d, yyyy"
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
                    disabledKeyboardNavigation
                    isClearable
                  />
                  <CalendarIcon className="absolute top-2 right-3 text-gray-500" />
                </div>
              </div>

              {/* End Date Field */}
              <div>
                <label className="block font-semibold text-gray-700">End Date (Optional)</label>
                <div className="relative">
                  <DatePicker
                    selected={endDate}
                    onChange={(date) => setDateRange([startDate, date])}
                    minDate={startDate}
                    maxDate={addDays(new Date(), 60)}
                    placeholderText="Select end date (optional)"
                    dateFormat="MMM d, yyyy"
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
                    disabledKeyboardNavigation
                    isClearable
                  />
                  <CalendarIcon className="absolute top-2 right-3 text-gray-500" />
                </div>
              </div>

              {/* Error Messages */}
              {errors.dates && <p className="text-red-500 text-sm">{errors.dates}</p>}

              {/* Reason Field */}
              <div>
                <label className="block font-semibold text-gray-700">Reason (Optional)</label>
                <Input
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Enter reason (optional)"
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
                />
              </div>

              {/* Submission Errors */}
              {errors.submit && <p className="text-red-500 text-sm">{errors.submit}</p>}

              {/* Submit Button */}
              <Button 
                type="submit" 
                className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-lg font-semibold transition duration-300"
                disabled={loading}
              >
                {loading ? "Submitting..." : "Mark Leave"}
              </Button>

              {/* Success Message */}
              {successMessage && (
                <p className="text-green-600 font-semibold text-center mt-3">{successMessage}</p>
              )}
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MarkLeave;
