/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'
import React, { useState } from 'react'
import { CiMail, CiUser, CiEdit } from "react-icons/ci";
import { Formik, Form, Field, ErrorMessage, FormikHelpers } from "formik";
import * as Yup from "yup";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import ErrorDisplay from '../shared/ErrorMsg';

const Contact = () => {
    return (
        <section className="w-full bg-white flex flex-col items-center gap-8 md:py-28 py-20">
            <div className="w-full flex flex-col gap-1 items-center">
                <h2 className='text-center text-color2 font-poppins font-bold md:text-4xl  text-3xl'>Contact Us</h2>
                <h4 className="text-color1 font-medium font-DM md:text-lg text-base">Get in Touch - We&apos;re Here to Help!</h4>
            </div>
            <div className="w-[90%] md:w-[60%] lg:w-[40%] p-4 md:p-8 border border-[#E5E7EB] rounded-[20px] shadow">
                {/* form */}
                <ContactForm />
            </div>
        </section>
    )
}

export default Contact


interface ContactFormValues {
    name: string,
    email: string;
    message: string;
}
const ContactForm = () => {
    const [isSending, setIsSending] = useState<boolean>(false);

    const initialValues: ContactFormValues = {
        name: "",
        email: "",
        message: "",
    };

    const validationSchema = Yup.object({
        name: Yup.string().required("Name is required"),
        email: Yup.string().email("Invalid Email Format").required("Email is required"),
        message: Yup.string().required("Message is required"),
    });

    const onSubmit = async (
        values: ContactFormValues,
        { resetForm }: FormikHelpers<ContactFormValues>
    ) => {

        setIsSending(true);

        try {
            console.log(values);
            setIsSending(false);
            resetForm();
        } catch (error) {
            console.log(error);
        }


        // const promise = new Promise(async (resolve, reject) => {

        //     try {
        //         console.log(values);
        //     } catch (error) {
        //         console.log(error);
        //     }

        // })


        // promise.finally(() => {
        //     setIsSending(false);
        //     resetForm();
        // });

    }

    return (
        <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={onSubmit}
            validateOnChange={true}
        >
            {(formik) => {
                const { dirty, isValid, errors } = formik;
                return (
                    <Form className="w-full h-auto flex flex-col items-center gap-4">
                        {/* Name */}
                        <div className="w-full">
                            <div className='w-full h-[48px] relative'>
                                <Field type="text" name="name" id="name" placeholder='Your name' className={`w-full rounded-[12px] border bg-[#F9FAFB] h-full font-poppins text-[14px] placeholder:text-[14px] placeholder:text-[#8E8C9C] text-[#8E8C9C] px-9 outline-none transition duration-300 ${errors.name ? "border-color1" : "border-[#E5E7EB]"}`} />
                                {/* icon */}
                                <CiUser className='w-5 h-5 absolute top-1/2 -translate-y-1/2 left-3 text-[#8E8C9C]' />
                            </div>
                            {/* error */}
                            <ErrorMessage name="name"
                                component={({ children }: any) => <ErrorDisplay message={children} />} />
                        </div>
                        {/* Email */}
                        <div className="w-full">
                            <div className='w-full h-[48px] relative'>
                                <Field type="email" name="email" id="email" placeholder='Email address' className={`w-full rounded-[12px] border bg-[#F9FAFB] h-full font-poppins text-[14px] placeholder:text-[14px] placeholder:text-[#8E8C9C] text-[#8E8C9C] px-9 outline-none transition duration-300  ${errors.email ? "border-color1" : "border-[#E5E7EB]"}`} />
                                {/* icon */}
                                <CiMail className='w-5 h-5 absolute top-1/2 -translate-y-1/2 left-3 text-[#8E8C9C]' />
                            </div>
                            {/* error */}
                            <ErrorMessage name="email"
                                component={({ children }: any) => <ErrorDisplay message={children} />} />
                        </div>
                        {/* Message */}
                        <div className="w-full">
                            <div className='w-full h-auto relative'>
                                <Field as="textarea" name="message" id="message" placeholder='Type message...' className={`w-full h-[65px] rounded-[12px] border bg-[#F9FAFB] font-poppins text-[14px] placeholder:text-[14px] placeholder:text-[#8E8C9C] text-[#8E8C9C] pl-9 pr-4 py-3 outline-none transition duration-300 ${errors.message ? "border-color1" : "border-[#E5E7EB]"}`} />
                                {/* icon */}
                                <CiEdit className='w-5 h-5 absolute top-3 left-3 text-[#8E8C9C]' />
                            </div>
                            {/* error */}
                            <ErrorMessage name="message"
                                component={({ children }: any) => <ErrorDisplay message={children} />} />
                        </div>

                        {/* btn */}
                        <button type="submit" disabled={!(dirty && isValid)} className='w-full h-[40px] flex justify-center items-center rounded-[8px] bg-color1 text-neutral-200 font-poppins font-[600] text-[14px] disabled:opacity-80 disabled:cursor-not-allowed'>
                            {
                                isSending ?
                                    (<span className="flex items-center text-neutral-200 gap-1">
                                        <AiOutlineLoading3Quarters className="animate-spin text-[#FFFFFF]" />
                                        Sending...
                                    </span>)
                                    : (<span>Submit</span>)
                            }
                        </button>
                    </Form>
                )
            }

            }
        </Formik>
    )
}