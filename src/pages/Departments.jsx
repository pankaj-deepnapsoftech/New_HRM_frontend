import { useAddDepartmentDataMutation, useDeleteDepartmentMutation, useGetAllDepartmentQuery, useUpdatedDepartmentDataMutation, } from '@/service/Department';
import { useFormik } from 'formik';
import { SquarePen, Trash } from 'lucide-react';
import React, { useState } from 'react'
import { IoIosClose } from 'react-icons/io';
import { toast } from 'react-toastify';

const Departments = () => {
    const [showModal, setShowModal] = useState(false)

    const [createDepartment, { isLoading, }] = useAddDepartmentDataMutation()
    const { data: departmentData, refetch } = useGetAllDepartmentQuery()
    const [deletedepartment, { isLoading: deleting }] = useDeleteDepartmentMutation()
    const [editTable, setEditable] = useState(null)
    const [updatedDepartment] = useUpdatedDepartmentDataMutation()



        const formik = useFormik({
            initialValues: {
                _id: editTable?._id || "",
                department_name: editTable?.department_name || "",
                sub_department: editTable?.sub_department || ""
            },
            enableReinitialize: true,
            onSubmit: async (values) => {
                
                try {
                    if (editTable) {
                        const res = await updatedDepartment(values).unwrap()
                        console.log(values)
                        if (res?.success === true) {
                            toast.success(res?.message)
                            setShowModal(false)
                            formik.resetForm()
                            refetch()
                        }
                    } else {
                        const res = await createDepartment(values).unwrap()
                        if (res?.success === true) {
                            toast.success(res?.message)
                            setShowModal(false)
                            formik.resetForm()
                            refetch()
                        }
                    }
                } catch (error) {
                    console.log(error)
                }
            }
        })

    const handledelete = async (id) => {
        try {
            if (window.confirm("are you sure you want to delete departments ?")) {
                const res = await deletedepartment(id)
                toast.success(res?.data?.message)
                refetch()
            }
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <div className="p-1 h-screen bg-gray-50 rounded shadow-md max-w-5xl mx-auto mt-10">

            <div className="bg-gradient-to-b from-gray-300 to bg-gray-300 text text-center  mx-5 md:mx-10 py-4 my-6 rounded-md shadow-md shadow-gray-400">
                <h2 className="text-xl font-[500]">All Department</h2>
            </div>
            <div className="flex justify-end mb-4 mx-5 md:mx-10">
                <button
                    onClick={() => {
                        setShowModal(true);
                        setEditable(null)
                    }}
                    className="bg-gradient-to-br from-slate-400 to bg-slate-600 hover:scale-105 text-white px-4 py-2 rounded-lg shadow-md"
                >
                    Add Department
                </button>
            </div>
            <div className="overflow-x-auto rounded-t-sm md:rounded-t-xl shadow-md mx-5 md:mx-10 mb-8 scrollbar-visible">
                <table className="min-w-full shadow-lg border border-gray-200 text-sm">
                    <thead className="bg-gray-200 text-[16px] text-gray-700 font-semibold">
                        <tr>
                            <th className="p-4 text-left whitespace-nowrap">Departments</th>
                            <th className="p-4 text-left whitespace-nowrap">Sub Departments</th>
                            <th className="p-4 text-left whitespace-nowrap">Action</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white">
                        {departmentData?.data?.length > 0 ? (
                            departmentData?.data?.map((dept, index) => (
                                <tr key={index} className="border-b border-gray-200 hover:bg-gray-50">
                                    <td className="p-4 whitespace-nowrap">{dept.department_name}</td>
                                    <td className="p-4 whitespace-nowrap">{dept.sub_department}</td>
                                    <td className="p-4 whitespace-nowrap flex gap-3">
                                        <button onClick={() => { setEditable(dept); setShowModal(true) }} >
                                            <SquarePen color='gray' size={18} />
                                        </button>
                                        <button disabled={deleting} onClick={() => handledelete(dept?._id)}>
                                            <Trash color='red' size={18} />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={2} className="text-center p-4">
                                    No departments found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>

            </div>


            {/* <Pagination page={page} setPage={setPage} hasNextPage={employee?.length === 10} /> */}


            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 bg-opacity-40">
                    <div className="bg-white p-6 rounded-md w-[90%] max-w-xl shadow-md relative">
                        <button
                            className="absolute top-4 right-4 text-gray-500 cursor-pointer hover:text-red-500 transition"
                            onClick={() => setShowModal(false)}
                            aria-label="Close"
                        >
                            <IoIosClose size={32} />
                        </button>
                        <h3 className="text-lg font-bold mb-4">{editTable ? "Edit Department" : "Add DepartMent"}</h3>

                        <form className="space-y-4" onSubmit={formik.handleSubmit}>
                            {/* Department Name */}
                            <div>
                                <label className="block font-medium text-sm mb-1">
                                    Department Name <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="department_name"
                                    value={formik.values.department_name}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    placeholder="Enter Department Name"
                                    className={`w-full border px-3 py-2 rounded ${formik.touched.department_name && formik.errors.department_name
                                        ? 'border-red-500'
                                        : 'border-gray-300'
                                        }`}
                                />
                                {formik.touched.department_name && formik.errors.department_name && (
                                    <p className="text-red-500 text-sm mt-1">{formik.errors.department_name}</p>
                                )}
                            </div>

                            {/* Sub Department */}
                            <div>
                                <label className="block font-medium text-sm mb-1">
                                    Sub Department <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="sub_department"
                                    value={formik.values.sub_department}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    placeholder="Enter Sub Department Name"
                                    className={`w-full border px-3 py-2 rounded ${formik.touched.sub_department && formik.errors.sub_department
                                        ? 'border-red-500'
                                        : 'border-gray-300'
                                        }`}
                                />
                                {formik.touched.sub_department && formik.errors.sub_department && (
                                    <p className="text-red-500 text-sm mt-1">{formik.errors.sub_department}</p>
                                )}
                            </div>

                            <div className="text-center">
                                <button
                                    disabled={isLoading}
                                    type="submit"
                                    className="bg-gradient-to-br from-slate-400 to bg-slate-600 hover:scale-105 text-white px-4 py-2 rounded-lg shadow-md"
                                >
                                    {isLoading ? "Submiting..." : " Submit"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Departments