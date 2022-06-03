import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { Host } from '../Data'
import { Link } from 'react-router-dom'
import FileUpload from '../Components/FileUpload';

function Home() {

    const [dataBaseCollections, setDataBaseCollections] = useState([]);
    const [showFileUploadSection, setShowFileUploadSection] = useState(false);

    const toggleFileUploadSection = () => {
        setShowFileUploadSection(!showFileUploadSection)
    }

    useEffect(() => {

        const getAllCollection = async () => {
            const res = await axios.get(`${Host}/api/getCollectionList`)
            const newCollections = [];
            res.data.forEach(collection => {
                if (collection.name !== "changeablefiends") {
                    newCollections.push(collection.name);
                }
            })
            setDataBaseCollections(newCollections);
        }
        getAllCollection();

    }, [])

    return (
        <div className=' w-full h-screen bg-gray-200'>
            <div className=' w-full h-full flex justify-center items-center'>
                <div className=' bg-white rounded shadow h-[600px] w-[500px] p-5'>
                    <p className=' font-semibold text-center text-xl'>All Campaing</p>
                    <div className=' w-full flex justify-end'>
                        <button onClick={toggleFileUploadSection} className=' border-blue-500 border-2 p-1 rounded text-blue-600'>Upload File</button>
                    </div>
                    <div className=' w-full mt-3'>
                        {
                            dataBaseCollections.map(collection => {
                                return (
                                    <Link to={`/show_data/${collection}`}>
                                        <p className=' font-semibold border-b py-2 text-lg'>{collection}</p>
                                    </Link>
                                )
                            })
                        }
                    </div>
                </div>
            </div>
            {
                showFileUploadSection &&
                <FileUpload dataBaseCollections={dataBaseCollections} toggleFileUploadSection={toggleFileUploadSection} setDataBaseCollections={setDataBaseCollections} />
            }
        </div>
    )
}

export default Home