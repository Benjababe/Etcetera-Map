import React from "react";
import { EtcObject, voteObject } from "../services/objects";
import classes from "../assets/styles/votewindow.module.css";
import { User } from "../services/user";

import voteUpIcon from "../assets/images/icons/vote-up.svg";
import voteDownIcon from "../assets/images/icons/vote-down.svg";

interface VoteWindowProps {
    user: User,
    etcObject: EtcObject,
    etcObjects: EtcObject[],
    setEtcObjects: React.Dispatch<React.SetStateAction<EtcObject[]>>,
}

export const VoteWindow = ({ user, etcObject, etcObjects, setEtcObjects }: VoteWindowProps) => {
    const voteEtcObject = async (voteVal: number) => {
        const res = await voteObject(user, etcObject.id, voteVal);
        if (res.success) {
            const updatedEtcObjects = etcObjects.map((eo) => {
                if (eo.id == etcObject.id)
                    eo.voted = res.voteVal;
                return eo;
            });
            setEtcObjects(updatedEtcObjects);
        }
    };

    return (
        <div className={`${classes.VoteWindow} ${(etcObject !== null) ? classes.VoteWindowShow : ""}`}>
            {(etcObject === null) ? "" :
                <>
                    <h2>{etcObject.type}</h2>
                    <h3>{etcObject.name}</h3>
                    <div>
                        <div className={classes.DetailRow}>
                            <span>Level:</span>
                            <span>{etcObject.level}</span>
                        </div>
                        <div className={classes.DetailRow}>
                            <span>Comments:</span>
                            <span>{etcObject.comments}</span>
                        </div>
                    </div>
                    {
                        (user !== null) ?
                            <div className={classes.VoteBox}>
                                <img
                                    className={`${classes.VoteIcon} ${(etcObject.voted == 1) ? classes.VoteUp : ""}`}
                                    src={voteUpIcon}
                                    onClick={() => voteEtcObject(1)} />
                                <img
                                    className={`${classes.VoteIcon} ${(etcObject.voted == -1) ? classes.VoteDown : ""}`}
                                    src={voteDownIcon}
                                    onClick={() => voteEtcObject(-1)} />
                            </div>
                            : ""
                    }
                </>
            }
        </div>
    );
};