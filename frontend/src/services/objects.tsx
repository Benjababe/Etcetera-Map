import { baseUrl } from "./constants";
import { User } from "./user";

const objectUrl = `${baseUrl}/api/objects`;
const voteUrl = `${baseUrl}/api/objectVote`;

interface VoteResponse {
    success: boolean;
    voteVal?: number;
}

interface CreateEtcObjectResponse {
    success: boolean;
    etcObject?: EtcObject;
    approved?: boolean;
    error?: string;
}

export interface EtcObject {
    id?: number;
    type?: string;
    name?: string;
    lat: number;
    lng: number;
    level?: string;
    comments?: string;
    voted?: number;
    images?: FileList;
    paths?: string[];
}

export const getEtcObjects = async (mapType: string): Promise<EtcObject[]> => {
    const url = `${objectUrl}?map_type=${mapType}`;
    const res = await fetch(url);
    const data: EtcObject[] = await res.json();

    return data;
};

export const createObject = async (user: User, etcObject: EtcObject): Promise<CreateEtcObjectResponse> => {
    const formData = new FormData();
    formData.append("type", etcObject.type);
    formData.append("lat", etcObject.lat.toString());
    formData.append("lng", etcObject.lng.toString());
    formData.append("level", etcObject.level);
    formData.append("comments", etcObject.comments);

    for (const image of etcObject.images) {
        formData.append("images", image);
    }

    const options = {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${user.authToken}`,
        },
        body: formData,
    };

    const res = await fetch(objectUrl, options);
    const data = await res.json();

    return data;
};

export const voteObject = async (user: User, etcObjectId: number, voteVal: number): Promise<VoteResponse> => {
    const options = {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${user.authToken}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ etcObjectId: etcObjectId, voteVal: voteVal }),
    };

    const res = await fetch(voteUrl, options);
    const data = await res.json();

    return data;
};