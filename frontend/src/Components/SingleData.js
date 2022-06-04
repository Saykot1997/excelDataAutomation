import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Host } from '../Data';

function SingleData({ data, campaingName, getAllData }) {

    const [dataObjectKey, setDataObjectKey] = useState([]);
    const [changeAbleFieldsKeys, setChangeAbleFieldsKeys] = useState([]);
    const [changeableFieldOptions, setChangeableFieldOptions] = useState({});
    const [changeFieldValue, setChangeFieldValue] = useState('');

    const UpdateData = async (value, key) => {

        const updateAbleData = {
            campaingName,
            key,
            value
        }

        try {

            await axios.post(`${Host}/api/update_data/${campaingName}/${data._id}`, updateAbleData);
            getAllData();
            setChangeFieldValue('');

        } catch (error) {

            console.log(error);
        }
    }

    useEffect(() => {

        try {
            if (data) {
                setDataObjectKey(Object.keys(data));
            }

            const get_changeable_fields = async () => {

                const res = await axios.get(`${Host}/api/get_changeable_fields/${campaingName}`);

                const newOptions = {};
                res.data.forEach(field => {
                    newOptions[field.changeableField] = field.values;
                })
                setChangeableFieldOptions(newOptions);

                const changeAbleFieldsKeys = [];
                res.data.forEach(field => {
                    changeAbleFieldsKeys.push(field.changeableField);
                })
                setChangeAbleFieldsKeys(changeAbleFieldsKeys);
            }
            get_changeable_fields();

        } catch (error) {
            console.log(error);
        }
    }, [data])

    return (
        <div>
            {
                dataObjectKey.map((key, index) => {
                    return (
                        <div key={index}>
                            {
                                changeAbleFieldsKeys.includes(key) ?
                                    <div className=' py-2 text-sm border-b'>
                                        <div className=' flex justify-between'>
                                            <span className=' font-semibold'>{key}</span>
                                            <select value={changeFieldValue} onChange={(e) => { UpdateData(e.target.value, key); setChangeFieldValue(e.target.value) }} name="" id="" className=' border border-blue-600 rounded p-[2px] focus:outline-none'>
                                                <option value="">select value</option>
                                                {
                                                    changeableFieldOptions[key].map((option, index) => {
                                                        return <option key={index} value={option}>{option}</option>
                                                    })
                                                }

                                            </select>
                                            <span className=' text-gray-700'>{data[key]}</span>
                                        </div>
                                    </div>
                                    :
                                    <div className=' py-1 text-sm border-b' >
                                        <div className=' flex justify-between'> <span className=' font-semibold'>{key} : </span><span>{data[key]}</span> </div>
                                    </div>
                            }
                        </div>
                    )
                })
            }
        </div>
    )
}

export default SingleData