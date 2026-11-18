import Foundation
import AppKit

let outDir = "public/assets/homepage2"
let fm = FileManager.default

func isBg(_ color: NSColor) -> Bool {
    let r = color.redComponent * 255
    let g = color.greenComponent * 255
    let b = color.blueComponent * 255
    // Beige background
    return r > 220 && g > 212 && b > 200 && abs(r - g) < 15 && abs(g - b) < 15
}

func trim(file: String) {
    let path = "\(outDir)/\(file)"
    guard let data = try? Data(contentsOf: URL(fileURLWithPath: path)),
          let rep = NSBitmapImageRep(data: data) else {
        return
    }
    
    let w = rep.pixelsWide
    let h = rep.pixelsHigh
    
    var top = 0
    var bottom = h - 1
    var left = 0
    var right = w - 1
    
    // Find top
    for y in 0..<h {
        var rowIsBg = true
        for x in stride(from: 0, to: w, by: 4) {
            if let c = rep.colorAt(x: x, y: y), !isBg(c) {
                rowIsBg = false
                break
            }
        }
        if !rowIsBg {
            top = y
            break
        }
    }
    
    // Find bottom
    for y in (0..<h).reversed() {
        var rowIsBg = true
        for x in stride(from: 0, to: w, by: 4) {
            if let c = rep.colorAt(x: x, y: y), !isBg(c) {
                rowIsBg = false
                break
            }
        }
        if !rowIsBg {
            bottom = y
            break
        }
    }
    
    // Find left
    for x in 0..<w {
        var colIsBg = true
        for y in stride(from: top, to: bottom, by: 4) {
            if let c = rep.colorAt(x: x, y: y), !isBg(c) {
                colIsBg = false
                break
            }
        }
        if !colIsBg {
            left = x
            break
        }
    }
    
    // Find right
    for x in (0..<w).reversed() {
        var colIsBg = true
        for y in stride(from: top, to: bottom, by: 4) {
            if let c = rep.colorAt(x: x, y: y), !isBg(c) {
                colIsBg = false
                break
            }
        }
        if !colIsBg {
            right = x
            break
        }
    }
    
    let cropW = right - left + 1
    let cropH = bottom - top + 1
    if cropW <= 10 || cropH <= 10 || (left == 0 && top == 0 && right == w - 1 && bottom == h - 1) {
        return
    }
    
    guard let cgImage = rep.cgImage?.cropping(to: CGRect(x: left, y: top, width: cropW, height: cropH)) else { return }
    let newRep = NSBitmapImageRep(cgImage: cgImage)
    guard let pngData = newRep.representation(using: .png, properties: [:]) else { return }
    try? pngData.write(to: URL(fileURLWithPath: path))
    print("Trimmed \(file): (\(w)x\(h)) -> (\(cropW)x\(cropH))")
}

let files = (try? fm.contentsOfDirectory(atPath: outDir)) ?? []
for file in files where file.hasSuffix(".png") && !file.contains("section_") && !file.contains("cert_") && !file.contains("facility") {
    trim(file: file)
}
