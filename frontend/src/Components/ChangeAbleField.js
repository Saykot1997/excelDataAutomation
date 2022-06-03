import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Host } from '../Data';

function ChangeAbleField({ toggleChangeAbleFild, data, campaingName, getAllData }) {

    const [dataObjectKey, setDataObjectKey] = useState([]);
    const [selectedField, setSelectedField] = useState('');
    const [selectedFieldValue, setSelectedFieldValue] = useState([]);
    const [selectedFieldValueQuantity, setSelectedFieldValueQuantity] = useState([]);
    const [changeAbleFields, setChangeAbleFields] = useState([]);

    useEffect(() => {

        if (data) {
            setDataObjectKey(Object.keys(data[0]));
        }

        try {
            const get_changeable_fields = async () => {
                const res = await axios.get(`${Host}/api/get_changeable_fields/${campaingName}`);
                setChangeAbleFields(res.data);
            }
            get_changeable_fields();

        } catch (error) {
            console.log(error);
        }
    }, [data])

    const ClearAllFields = () => {
        setSelectedFieldValue([]);
        setSelectedFieldValueQuantity([]);
    }

    const changeFieldValue = (value, index) => {
        if (!selectedFieldValue.includes(value)) {
            const newValues = [...selectedFieldValue];
            newValues[index] = value;
            setSelectedFieldValue(newValues);
        }
    }

    const IncrementFieldQuantity = () => {

        if (selectedFieldValueQuantity.length > 0) {
            setSelectedFieldValueQuantity([...selectedFieldValueQuantity, selectedFieldValueQuantity[selectedFieldValueQuantity.length - 1] + 1]);
        } else {
            setSelectedFieldValueQuantity([1]);
        }
    }

    const SaveChangeAbleValue = async () => {

        if (!selectedFieldValue.length > 0) {
            alert('Please select at least one value');
            return;
        }
        if (!selectedField) {
            alert('Please select a field');
            return;
        }

        try {

            const data = {
                campaingName: campaingName,
                changeableField: selectedField,
                values: selectedFieldValue,
            }

            const res = await axios.post(`${Host}/api/set_changeable_field`, data);
            setChangeAbleFields([...changeAbleFields, res.data]);
            ClearAllFields()
            setSelectedField('');
            getAllData();

        } catch (error) {
            console.log(error);
        }
    }

    return (
        <div className=' w-full h-screen fixed top-0 right-0 bg-black bg-opacity-50'>
            <div className=' w-full flex justify-end p-10'>
                <button onClick={toggleChangeAbleFild} className="bg-red-600 rounded p-2 text-white">Close</button>
            </div>
            <div className=' w-full flex justify-center'>
                <div className=' bg-white h-[550px] overflow-y-scroll p-5'>
                    <p className=' mb-3 text-center font-semibold text-lg'>Changeable Fields</p>
                    <select value={selectedField} onChange={(e) => { setSelectedField(e.target.value) }} name="" id="" className=' border border-blue-500 p-2 rounded focus:outline-none'>
                        <option value="">Select Changeable Field</option>
                        {
                            dataObjectKey.length > 0 && dataObjectKey.map((key, index) => {
                                return (
                                    <option key={index} value={key}>{key}</option>
                                )
                            })
                        }
                    </select>
                    <div className=' w-full flex justify-between mt-5 items-start'>
                        <div>
                            {
                                selectedFieldValueQuantity.map((value, index) => {
                                    return (
                                        <div className=' my-2'>
                                            <input onChange={(e) => changeFieldValue(e.target.value, index)} type="text" placeholder='Enter Field Value' className='border border-blue-500 p-2 rounded focus:outline-none' />
                                        </div>
                                    )
                                })
                            }
                        </div>
                        <div>
                            {
                                selectedFieldValueQuantity.length > 0 &&
                                <button onClick={ClearAllFields} className=' bg-red-600 text-white rounded p-2 mr-2 hover:bg-red-700'>Clear All Fields</button>
                            }
                            <button onClick={IncrementFieldQuantity} className=' text-white bg-blue-600 hover:bg-blue-700 p-2 rounded focus:outline-none'>Add Field</button>
                        </div>
                    </div>
                    {
                        selectedFieldValueQuantity.length > 0 &&
                        <div className=' w-full flex justify-center'>
                            <button onClick={SaveChangeAbleValue} className=' text-white bg-blue-600 hover:bg-blue-700 px-3 py-2 rounded focus:outline-none'>Save</button>
                        </div>
                    }
                    {
                        changeAbleFields.length > 0 &&
                        <div className=' w-full'>
                            {
                                changeAbleFields.map((field, index) => {
                                    return (
                                        <div className=' w-full'>
                                            <div>
                                                <span className='text-gray-800 font-semibold'>{field.changeableField} : </span>
                                            </div>
                                            <div className='my-2'>
                                                {
                                                    field.values.map((value, index) => {
                                                        return (
                                                            <p className='text-gray-700 ml-5 text-sm my-2'>{value}</p>
                                                        )
                                                    })
                                                }
                                            </div>
                                        </div>
                                    )
                                })
                            }
                        </div>
                    }
                </div>
            </div>
        </div>
    )
}

export default ChangeAbleField