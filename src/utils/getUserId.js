import Cookies from 'universal-cookie'
import jwt_Decode from 'jwt-decode'


const cookies = new Cookies();

export function getUserId() {

    const jwt_token = cookies.get("jwt-authorization")
    if(jwt_token===undefined) return null
    const decoced = jwt_Decode(jwt_token);
    return decoced.id;
}





