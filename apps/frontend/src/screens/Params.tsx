
import { useParams } from 'react-router-dom'; 

export default function Params() {
    const params = useParams();
    params.spaceid;

    console.log(params.spaceid);
    

  return (
    <div>Params</div>
  );
}
