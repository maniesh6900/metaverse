import React, { useEffect } from 'react';
import asiox from 'axios';
import { Link, Router } from 'react-router-dom';
 
function GetSpaces() {
    const [res, SetRes] = React.useState<any>(null);
    useEffect(() => {
        (async() => {
            const res = await asiox.get(`http://localhost:3000/api/v1/admin/spaces`);
            SetRes(res.data.data);
            console.log(res.data.data);
        })();
    },[]);
  
    const handleClick = (id: string) => {
        console.log(id);

    };

    return (
    <>
   
        <div 
            className='flex flex-wrap'>
        {
            res?.map((space: any) => (
               
                <div 
                onClick={() => {handleClick(space.id);}}
                className=' p-4 m-4 rounded-lg shadow-lg'
                key={space.id}
                >
                <Link to={`/space/${space.id}`}>
                    <h2 className='text-center'>{space.name}</h2>
                    <img 
                        src={space.thumbnail} 
                        alt="Thumbnail"  
                        className='w-32 h-32 object-cover'
                        />
                    <p>size : {space.height} X {space.width}</p>
                </Link>
            </div>
           )) 
        }
        </div>
    </>
  );
}

export default GetSpaces;