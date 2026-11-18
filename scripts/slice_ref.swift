import Foundation
import AppKit

let imagePath = "WEBSITE DESIGN /ref_homepage_desktop.png"
let outDir = "public/assets/homepage2"

let fileManager = FileManager.default
try? fileManager.createDirectory(atPath: outDir, withIntermediateDirectories: true, attributes: nil)

guard let data = try? Data(contentsOf: URL(fileURLWithPath: imagePath)),
      let rep = NSBitmapImageRep(data: data) else {
    print("Could not load image rep")
    exit(1)
}

let totalW = CGFloat(rep.pixelsWide)
let totalH = CGFloat(rep.pixelsHigh)
print("Image dimensions: \(totalW) x \(totalH)")

func cropAndSave(name: String, x: CGFloat, y: CGFloat, width: CGFloat, height: CGFloat) {
    let rect = CGRect(x: x, y: y, width: width, height: height)
    guard let cgImage = rep.cgImage?.cropping(to: rect) else {
        print("Failed to crop \(name)")
        return
    }
    let newRep = NSBitmapImageRep(cgImage: cgImage)
    newRep.size = NSSize(width: width, height: height)
    guard let pngData = newRep.representation(using: NSBitmapImageRep.FileType.png, properties: [:]) else {
        print("Failed to get PNG data for \(name)")
        return
    }
    let outPath = "\(outDir)/\(name).png"
    try? pngData.write(to: URL(fileURLWithPath: outPath))
    print("Saved \(outPath) (\(Int(width))x\(Int(height)))")
}

// Let's test cropping a vertical slice to verify coordinate orientation
// Note: In CGImage.cropping(to: rect), origin is top-left in CoreGraphics when loading from file or bitmap rep
cropAndSave(name: "test_top", x: 0, y: 0, width: totalW, height: 1000)
