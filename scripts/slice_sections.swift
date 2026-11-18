import Foundation
import AppKit

let imagePath = "WEBSITE DESIGN /ref_homepage_desktop.png"
let outDir = "public/assets/homepage2"

let fileManager = FileManager.default
try? fileManager.createDirectory(atPath: outDir, withIntermediateDirectories: true, attributes: nil)

guard let data = try? Data(contentsOf: URL(fileURLWithPath: imagePath)),
      let rep = NSBitmapImageRep(data: data) else {
    exit(1)
}

func cropAndSave(name: String, x: CGFloat, y: CGFloat, width: CGFloat, height: CGFloat, scale: CGFloat = 1.0) {
    let rect = CGRect(x: x, y: y, width: width, height: height)
    guard let cgImage = rep.cgImage?.cropping(to: rect) else {
        print("Failed to crop \(name)")
        return
    }
    
    let targetW = width * scale
    let targetH = height * scale
    
    let colorSpace = CGColorSpaceCreateDeviceRGB()
    guard let ctx = CGContext(data: nil,
                              width: Int(targetW),
                              height: Int(targetH),
                              bitsPerComponent: 8,
                              bytesPerRow: 0,
                              space: colorSpace,
                              bitmapInfo: CGImageAlphaInfo.premultipliedLast.rawValue) else {
        print("Failed to create context for \(name)")
        return
    }
    
    ctx.interpolationQuality = .high
    ctx.draw(cgImage, in: CGRect(x: 0, y: 0, width: targetW, height: targetH))
    
    guard let scaledCg = ctx.makeImage() else { return }
    let newRep = NSBitmapImageRep(cgImage: scaledCg)
    guard let pngData = newRep.representation(using: .png, properties: [:]) else { return }
    
    let outPath = "\(outDir)/\(name).png"
    try? pngData.write(to: URL(fileURLWithPath: outPath))
    print("Saved \(outPath) (\(Int(targetW))x\(Int(targetH)))")
}

// Save high level section overviews at 0.25 scale for easy visual inspection
let W = CGFloat(rep.pixelsWide)
cropAndSave(name: "section_0_header_hero", x: 0, y: 0, width: W, height: 2300, scale: 0.5)
cropAndSave(name: "section_1_products_glance", x: 0, y: 2300, width: W, height: 1500, scale: 0.5)
cropAndSave(name: "section_2_facility", x: 0, y: 3800, width: W, height: 1800, scale: 0.5)
cropAndSave(name: "section_3_who_we_are", x: 0, y: 5600, width: W, height: 1600, scale: 0.5)
cropAndSave(name: "section_4_why_works", x: 0, y: 7200, width: W, height: 1600, scale: 0.5)
cropAndSave(name: "section_5_bestsellers", x: 0, y: 8800, width: W, height: 3000, scale: 0.5)
cropAndSave(name: "section_6_testimonials", x: 0, y: 11800, width: W, height: 1100, scale: 0.5)
cropAndSave(name: "section_7_certifications", x: 0, y: 12900, width: W, height: 1300, scale: 0.5)
cropAndSave(name: "section_8_faq", x: 0, y: 14200, width: W, height: 1500, scale: 0.5)
cropAndSave(name: "section_9_footer", x: 0, y: 15700, width: W, height: CGFloat(rep.pixelsHigh) - 15700, scale: 0.5)
