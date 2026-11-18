import Foundation
import AppKit

let imagePath = "WEBSITE DESIGN /ref_homepage_desktop.png"
guard let data = try? Data(contentsOf: URL(fileURLWithPath: imagePath)),
      let rep = NSBitmapImageRep(data: data) else {
    exit(1)
}

func isBg(_ color: NSColor) -> Bool {
    let r = color.redComponent * 255
    let g = color.greenComponent * 255
    let b = color.blueComponent * 255
    // Background is #F3EEE6 -> ~243, ~238, ~230
    // Also ripple lines are slightly darker: ~225 to 245
    return r > 215 && g > 210 && b > 200 && abs(r - g) < 15 && abs(g - b) < 15
}

func findBounds(in searchRect: CGRect) -> CGRect? {
    let minX = Int(searchRect.minX)
    let maxX = Int(searchRect.maxX)
    let minY = Int(searchRect.minY)
    let maxY = Int(searchRect.maxY)
    
    var top = maxY
    var bottom = minY
    var left = maxX
    var right = minX
    var found = false
    
    for y in stride(from: minY, to: maxY, by: 2) {
        for x in stride(from: minX, to: maxX, by: 4) {
            if let c = rep.colorAt(x: x, y: y) {
                if !isBg(c) {
                    found = true
                    if y < top { top = y }
                    if y > bottom { bottom = y }
                    if x < left { left = x }
                    if x > right { right = x }
                }
            }
        }
    }
    
    if !found { return nil }
    return CGRect(x: left, y: top, width: right - left, height: bottom - top)
}

// Let's test finding bounds for each item:
print("--- HERO MOSAIC ---")
// 10 items
let heroCols: [CGFloat] = [300, 860, 1420, 1980, 2550]
for (cIdx, colX) in heroCols.enumerated() {
    let b1 = findBounds(in: CGRect(x: colX, y: 800, width: 560, height: 600))
    let b2 = findBounds(in: CGRect(x: colX, y: 1300, width: 560, height: 600))
    print("Col \(cIdx) top: \(b1 ?? .zero), bot: \(b2 ?? .zero)")
}

print("--- PRODUCTS GLANCE ---")
for x in [300, 1250, 2200] {
    let b = findBounds(in: CGRect(x: CGFloat(x), y: 2500, width: 920, height: 800))
    print("Glance at \(x): \(b ?? .zero)")
}

print("--- BESTSELLERS ---")
let bsCols: [CGFloat] = [300, 1740]
for y in [9300, 10300] {
    for x in bsCols {
        let b = findBounds(in: CGRect(x: x, y: CGFloat(y), width: 1400, height: 850))
        print("Bestseller at x:\(x), y:\(y): \(b ?? .zero)")
    }
}
