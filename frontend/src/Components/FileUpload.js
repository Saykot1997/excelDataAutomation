import React, { useState } from 'react'
import axios from 'axios'
import { Host } from '../Data'

function FileUpload({ toggleFileUploadSection, dataBaseCollections, setDataBaseCollections }) {

    const [file, setFile] = useState(null);
    const [campaingName, setCampaingName] = useState('');

    const chackData = () => {

        if (!campaingName) {
            alert('Please enter campaing name');
            return;
        }
        if (!file) {
            alert('Please select file');
            return;
        }

        const isExist = dataBaseCollections.find(collection => collection === campaingName);

        if (isExist) {

            window.confirm('This campaing name is already exist. Do you want to replace all the data?') && UploadFile()

        } else {

            UploadFile()
        }
    }

    const UploadFile = async () => {

        const formData = new FormData();
        formData.append('file', file);
        formData.append('campaingName', campaingName);

        const config = {
            headers: {
                'content-type': 'multipart/form-data'
            }
        }

        try {

            const res = await axios.post(`${Host}/api/upload_excel_file`, formData, config);
            const newCollections = [];
            res.data.forEach(collection => {
                if (collection.name !== "changeablefiends") {
                    newCollections.push(collection.name);
                }
            })
            setDataBaseCollections(newCollections);
            toggleFileUploadSection();

        } catch (error) {
            console.log(error);
        }

    }




    return (
        <div className=' fixed h-screen w-full bg-black bg-opacity-30 top-0 right-0'>
            <div className=' w-full p-10 flex justify-end'>
                <button onClick={toggleFileUploadSection} className="bg-red-600 text-white rounded p-2">Close</button>
            </div>
            <div className=' w-full flex justify-center'>
                <div className=' bg-white shadow rounded p-32'>
                    {
                        !file &&
                        <div className=' flex justify-center items-center'>
                            <label htmlFor="file" className=' bg-blue-500 text-white rounded p-2 cursor-pointer'>Select File</label>
                            <input onChange={(e) => { setFile(e.target.files[0]) }} type="file" id='file' className=' hidden' />
                        </div>
                    }
                    {
                        file &&
                        <div className=' w-full flex justify-center'>
                            <input value={campaingName} onChange={(e) => { setCampaingName(e.target.value) }} type="text" placeholder='Enter File Name' className=' border border-blue-500 rounded p-2 focus:outline-none mr-2' />
                            <button onClick={chackData} className=' bg-purple-500 text-white rounded p-2'>Upload File</button>
                        </div>
                    }
                </div>
            </div>
        </div>
    )
}

export default FileUpload