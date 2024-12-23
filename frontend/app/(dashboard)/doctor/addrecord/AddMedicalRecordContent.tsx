"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import React from 'react';
import success from "@/public/json/success.json";
import error from "@/public/json/error.json";
import { useForm } from 'react-hook-form';
import StepperForm from '@/components/stepper/stepper-form';


import dynamic from 'next/dynamic';

// Dynamically import the Player component with SSR disabled
const Player = dynamic(
  () => import('@lottiefiles/react-lottie-player').then((mod) => mod.Player),
  { ssr: false }
);

interface FormData {
  propertyTitleDeed: FileList;
  propertyImage: FileList;
  [key: string]: any;
}

const AddMedicalRecordContent = () => {
  const [notification, setNotification] = React.useState<string>();
  const [openSuccess, setOpenSuccess] = React.useState(false);
  const [openError, setOpenError] = React.useState(false);
  const [date, setDate] = React.useState<Date>();
  const [isLoading, setIsLoading] = React.useState(false);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<FormData>();

  const convertBase64 = async (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(file);

      fileReader.onload = () => {
        resolve(fileReader.result as string);
      };

      fileReader.onerror = (error) => {
        reject(error);
      };
    });
  };

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    try {
      const propertyTitleDeedbase64 = await convertBase64(
        data.propertyTitleDeed[0]
      );
      const propertyImageBase64 = await convertBase64(
        data.propertyImage[0]
      );
      const acquistionDateString = date?.toDateString();

      // Your submit logic here

      setOpenSuccess(true);
    } catch (err) {
      console.error('Submission error:', err);
      setNotification("Failed to enlist");
      setOpenError(true);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle dialog states
  const handleDialogClose = (type: 'success' | 'error') => {
    if (type === 'success') setOpenSuccess(false);
    if (type === 'error') setOpenError(false);
  };

  return (
    <main className="xl:mx-[100px] h-full">
      <Dialog open={openSuccess} onOpenChange={() => handleDialogClose('success')}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="mb-[20px]">
              Property Enlisted Successfully
            </DialogTitle>
            <Player
              keepLastFrame
              autoplay
              src={success}
              style={{ height: "300px", width: "300px" }}
            />
          </DialogHeader>
        </DialogContent>
      </Dialog>

      <Dialog open={openError} onOpenChange={() => handleDialogClose('error')}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="mb-[20px]">
              Property Enlisting Failed
            </DialogTitle>
            <Player
              keepLastFrame
              autoplay
              src={error}
              style={{ height: "300px", width: "300px" }}
            />
          </DialogHeader>
        </DialogContent>
      </Dialog>

      {notification && (
        <div className="bg-red-50 text-red-500 p-3 rounded-md mb-4">
          {notification}
        </div>
      )}

      <div className={`transition-opacity duration-200 ${isLoading ? 'opacity-50' : 'opacity-100'}`}>
        <form onSubmit={handleSubmit(onSubmit)}>
        </form>
      </div>
    </main>
  );
}

export default AddMedicalRecordContent;