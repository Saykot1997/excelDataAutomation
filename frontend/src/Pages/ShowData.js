import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import axios from 'axios';
import { Host } from '../Data';
import SingleData from '../Components/SingleData';
import ChangeAbleField from '../Components/ChangeAbleField';

function ShowData() {

    const location = useLocation();
    const collectionName = location.pathname.split('/')[2];
    const [data, setData] = useState([]);
    const [currantPageIndex, setCurrantPageIndex] = useState(0);
    const [showChangeAbleFild, setShowChangeAbleFild] = useState(false);
    const [gotoPageNumber, setGotoPageNumber] = useState("");

    const GotoPage = () => {

        if (!gotoPageNumber) {
            alert("Please enter a number");
            return;
        }
        if (gotoPageNumber > data.length) {
            alert("Page number is too big");
            return;
        }
        if (gotoPageNumber < 1) {
            alert("Page number is too small");
            return;
        }
        setCurrantPageIndex(gotoPageNumber - 1);
        setGotoPageNumber("");
    }


    const toggleChangeAbleFild = () => {
        setShowChangeAbleFild(!showChangeAbleFild);
    }

    const goToPrevPage = () => {
        if (currantPageIndex > 0) {
            setCurrantPageIndex(currantPageIndex - 1);
        }
        setGotoPageNumber("");
    }

    const goToNextPage = () => {
        if (currantPageIndex < data.length - 1) {
            setCurrantPageIndex(currantPageIndex + 1);
        }
        setGotoPageNumber("");
    }

    const getCollectionData = async () => {
        const res = await axios.get(`${Host}/api/collection_data/${collectionName}`);
        setData(res.data);
    }

    useEffect(() => {
        try {
            getCollectionData();
        } catch (error) {
            console.log(error);
        }
    }, [])

    const DownloadExcelFile = async () => {

        axios.get(`${Host}/api/download_excel_file/${collectionName}`, {
            method: 'GET',
            responseType: 'blob',
        }).then((response) => {
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `${Date.now()}.xlsx`);
            document.body.appendChild(link);
            link.click();
        });
    }


    return (
        <div className=' w-full px-10 py-3 flex justify-center bg-gray-200'>
            {
                data.length > 0 &&
                <div className=' w-full px-32'>
                    <p className=' text-lg font-semibold text-center capitalize'>File - {collectionName}</p>
                    <p className=' font-semibold text-sm text-center'>Showing {currantPageIndex + 1} data from {data.length} data</p>
                    <div className='w-full flex justify-between my-3'>
                        <div className=''>
                            <button onClick={DownloadExcelFile} className=' bg-white p-2 text-sm rounded font-semibold mr-2 hover:bg-gray-100'>Download Excel File</button>
                            <button onClick={toggleChangeAbleFild} className=' bg-white p-2 text-sm rounded font-semibold hover:bg-gray-100' >Set ChangeAble Fild</button>
                        </div>
                        <div className=' flex items-center'>
                            <div className=' flex items-center'>
                                <input value={gotoPageNumber} onChange={(e) => setGotoPageNumber(e.target.value)} type="text" placeholder='Enter Number' className='mr-2 focus:outline-none px-2 py-[6px] rounded' />
                                <button onClick={GotoPage} className='bg-white p-2 text-sm rounded font-semibold mr-2 hover:bg-gray-100'>Go to</button>
                            </div>
                            <div className=' flex items-center'>
                                <button onClick={goToPrevPage} className=' bg-white p-2 text-sm rounded font-semibold mr-2 hover:bg-gray-100 disabled:bg-gray-300' disabled={currantPageIndex === 0}>Previous</button>
                                <button onClick={goToNextPage} className='bg-white p-2 text-sm rounded font-semibold hover:bg-gray-100 disabled:bg-gray-300' disabled={currantPageIndex === data.length - 1}>Next</button>
                            </div>
                        </div>
                    </div>

                    <div className=' bg-white shadow rounded p-5'>
                        {
                            data.length > 0 &&
                            <SingleData data={data[currantPageIndex]} campaingName={collectionName} getAllData={getCollectionData} />
                        }
                    </div>
                    {
                        showChangeAbleFild &&
                        <ChangeAbleField toggleChangeAbleFild={toggleChangeAbleFild} data={data} campaingName={collectionName} getAllData={getCollectionData} />
                    }
                </div>
            }
        </div>
    )
}

export default ShowData