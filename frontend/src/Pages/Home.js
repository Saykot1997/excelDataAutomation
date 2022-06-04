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

    const getAllCollection = async () => {

        try {

            const res = await axios.get(`${Host}/api/getCollectionList`)
            const newCollections = [];
            res.data.forEach(collection => {
                if (collection.name !== "changeablefiends") {
                    newCollections.push(collection.name);
                }
            })
            setDataBaseCollections(newCollections);

        } catch (error) {

            console.log(error);
        }
    }


    const DeleteCollection = (collectionName) => {

        window.confirm('Are you sure you want to delete this collection?. All data of this collection will be deleted.') && deleteData(collectionName)
    }

    const deleteData = async (collectionName) => {

        try {

            await axios.delete(`${Host}/api/delete_collection/${collectionName}`);
            getAllCollection();

        } catch (error) {

            console.log(error);
        }
    }

    useEffect(() => {

        getAllCollection();

    }, [])

    return (
        <div className=' w-full h-screen bg-gray-200'>
            <div className=' w-full h-full flex justify-center items-center'>
                <div className=' bg-white rounded shadow h-[500px] w-[500px] overflow-y-scroll scrollbar p-5'>
                    <p className=' font-semibold text-center text-xl'>All Campaing</p>
                    <div className=' w-full flex justify-end'>
                        <button onClick={toggleFileUploadSection} className=' shadow shadow-blue-300 text-blue-600 text-sm p-1 hover:scale-105 ease-in transition-all'>Upload File</button>
                    </div>
                    <div className=' w-full mt-3'>
                        {
                            dataBaseCollections.map(collection => {
                                return (
                                    <div className=' flex items-center justify-between font-semibold border-b py-2'>

                                        <Link to={`/show_data/${collection}`}>
                                            <p className='pr-10'>{collection}</p>
                                        </Link>
                                        <button onClick={() => DeleteCollection(collection)} className="text-sm p-1 shadow-sm shadow-red-300 text-red-600 hover:scale-105 ease-in transition-all">Delete</button>
                                    </div>
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