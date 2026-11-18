import Foundation
import AppKit

let imagePath = "WEBSITE DESIGN /ref_homepage_desktop.png"
guard let data = try? Data(contentsOf: URL(fileURLWithPath: imagePath)),
      let rep = NSBitmapImageRep(data: data) else {
    exit(1)
}

let H = rep.pixelsHigh
let W = rep.pixelsWide

print("Sampling y at x=\(W/2) and x=300:")
var lastHex = ""
for y in stride(from: 0, to: H, by: 100) {
    if let colorMid = rep.colorAt(x: W / 2, y: y),
       let colorLeft = rep.colorAt(x: 300, y: y) {
        let rMid = Int(colorMid.redComponent * 255)
        let gMid = Int(colorMid.greenComponent * 255)
        let bMid = Int(colorMid.blueComponent * 255)
        let hexMid = String(format: "#%02X%02X%02X", rMid, gMid, bMid)

        let rLeft = Int(colorLeft.redComponent * 255)
        let gLeft = Int(colorLeft.greenComponent * 255)
        let bLeft = Int(colorLeft.blueComponent * 255)
        let hexLeft = String(format: "#%02X%02X%02X", rLeft, gLeft, bLeft)

        print("y=\(y): mid=\(hexMid), left=\(hexLeft)")
    }
}
