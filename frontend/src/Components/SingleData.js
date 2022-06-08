import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { Host } from '../Data';

function SingleData({ data, campaingName, allData, setAllData, currantPageIndex, goToNextPage }) {

    const [dataObjectKey, setDataObjectKey] = useState([]);
    const [changeAbleFieldsKeys, setChangeAbleFieldsKeys] = useState([]);
    const [changeableFieldOptions, setChangeableFieldOptions] = useState({});
    const user = useSelector(state => state.User.User);

    const UpdateData = async (value, key) => {

        const updateAbleData = {
            campaingName,
            key,
            value
        }

        try {

            await axios.post(`${Host}/api/update_data/${campaingName}/${data._id}`, updateAbleData, {
                headers: {
                    'Authorization': `Bearer ${user.token}`
                }
            });
            const newAllData = [...allData];
            const newData = { ...data };
            newData[key] = value;
            newAllData[currantPageIndex] = newData;
            setAllData(newAllData);
            goToNextPage();

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

                const res = await axios.get(`${Host}/api/get_changeable_fields/${campaingName}`, {
                    headers: {
                        'Authorization': `Bearer ${user.token}`
                    }
                });

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
                                            {
                                                changeableFieldOptions[key].length > 0 &&
                                                <div>
                                                    {
                                                        changeableFieldOptions[key].map((option, index) => {
                                                            return <button key={index} value={option} onClick={(e) => UpdateData(e.target.value, key)} className=" mr-2 shadow shadow-blue-300 p-1 rounded text-blue-600 font-semibold" >{option}</button>
                                                        })
                                                    }
                                                </div>
                                            }
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