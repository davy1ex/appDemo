import { Scanner } from '@yudiel/react-qr-scanner';
import { useState } from 'react';
import {fetchOnScan} from "@/features/qr-scan/scanQrCode"
import "./style.css"

export const QRScanPage = () => {
    const [isScanned, setIsScanned] = useState(false)

    const onScan = (result) => {
        setIsScanned(true)
        console.log(result[0].rawValue)
        fetchOnScan()
    }

    return (
        (isScanned ? (
            "ok, boomer"
        ): (
            <div className={"scanner-container"}>
                <Scanner  onScan={(result) => onScan(result)} />
            </div>
        ))
    )
}