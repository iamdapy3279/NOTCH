import Foundation
import AppKit

let imagePath = "WEBSITE DESIGN /ref_homepage_desktop.png"
let outDir = "public/assets/homepage2"

guard let data = try? Data(contentsOf: URL(fileURLWithPath: imagePath)),
      let rep = NSBitmapImageRep(data: data) else {
    exit(1)
}

func crop(name: String, x: CGFloat, y: CGFloat, width: CGFloat, height: CGFloat, scale: CGFloat = 1.0) {
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
        return
    }
    ctx.interpolationQuality = .high
    ctx.draw(cgImage, in: CGRect(x: 0, y: 0, width: targetW, height: targetH))
    guard let scaled = ctx.makeImage() else { return }
    let newRep = NSBitmapImageRep(cgImage: scaled)
    guard let pngData = newRep.representation(using: .png, properties: [:]) else { return }
    let outPath = "\(outDir)/\(name).png"
    try? pngData.write(to: URL(fileURLWithPath: outPath))
    print("Saved \(name): \(Int(targetW))x\(Int(targetH))")
}

// 1. Logo Header & Footer
crop(name: "logo_header", x: 300, y: 44, width: 350, height: 68)
crop(name: "logo_footer", x: 374, y: 15784, width: 350, height: 68)

// 2. Hero Social Proof Avatars
crop(name: "hero_avatars", x: 1475, y: 648, width: 120, height: 50)

// 3. Hero Mosaic (10 images):
// Col 0:
crop(name: "hero_m1", x: 312, y: 958, width: 532, height: 440)
crop(name: "hero_m2", x: 312, y: 1424, width: 532, height: 356)
// Col 1:
crop(name: "hero_m3", x: 876, y: 1042, width: 536, height: 440)
crop(name: "hero_m4", x: 876, y: 1512, width: 536, height: 268)
// Col 2:
crop(name: "hero_m5", x: 1440, y: 1144, width: 536, height: 440)
crop(name: "hero_m6", x: 1440, y: 1614, width: 536, height: 166)
// Col 3:
crop(name: "hero_m7", x: 2004, y: 1042, width: 536, height: 440)
crop(name: "hero_m8", x: 2004, y: 1512, width: 536, height: 268)
// Col 4:
crop(name: "hero_m9", x: 2574, y: 958, width: 532, height: 440)
crop(name: "hero_m10", x: 2574, y: 1424, width: 532, height: 356)

// 4. Products at a Glance (3 cards):
crop(name: "glance_plates_bowls", x: 312, y: 2620, width: 892, height: 670, scale: 0.75)
crop(name: "glance_meal_trays", x: 1262, y: 2620, width: 892, height: 670, scale: 0.75)
crop(name: "glance_compartment_plates", x: 2216, y: 2620, width: 892, height: 670, scale: 0.75)

// 5. Facility:
crop(name: "facility_full", x: 312, y: 3950, width: 2796, height: 1520, scale: 0.75)

// 6. Who are we (3 images):
crop(name: "who_hands_team", x: 1736, y: 5880, width: 400, height: 380)
crop(name: "who_sugarcane", x: 1736, y: 6300, width: 400, height: 480)
crop(name: "who_moss_hands", x: 2176, y: 5880, width: 856, height: 900, scale: 0.75)

// 7. Why our tableware works (5 cards):
crop(name: "works_food_safe", x: 808, y: 7420, width: 580, height: 536, scale: 0.75)
crop(name: "works_plastic_free", x: 1420, y: 7420, width: 580, height: 536, scale: 0.75)
crop(name: "works_compostable", x: 2032, y: 7420, width: 580, height: 536, scale: 0.75)
crop(name: "works_microwave", x: 808, y: 8000, width: 886, height: 536, scale: 0.75)
crop(name: "works_reused", x: 1726, y: 8000, width: 886, height: 536, scale: 0.75)

// 8. Bestsellers (4 images):
crop(name: "bestseller_plates", x: 312, y: 9480, width: 1362, height: 690, scale: 0.75)
crop(name: "bestseller_bowls", x: 1752, y: 9480, width: 1362, height: 690, scale: 0.75)
crop(name: "bestseller_trays", x: 312, y: 10476, width: 1362, height: 690, scale: 0.75)
crop(name: "bestseller_compartment", x: 1752, y: 10476, width: 1362, height: 690, scale: 0.75)

// 9. Certifications:
crop(name: "cert_brcgs", x: 1056, y: 13210, width: 270, height: 210)
crop(name: "cert_sedex", x: 1406, y: 13210, width: 260, height: 210)
crop(name: "cert_sgs", x: 1750, y: 13210, width: 260, height: 210)
crop(name: "cert_cipet", x: 2090, y: 13210, width: 260, height: 210)
crop(name: "cert_iso_9001", x: 1056, y: 13530, width: 270, height: 240)
crop(name: "cert_iso_14001", x: 1406, y: 13530, width: 260, height: 240)
crop(name: "cert_iso_45001", x: 1750, y: 13530, width: 260, height: 240)
crop(name: "cert_iso_22000", x: 2090, y: 13530, width: 260, height: 240)
