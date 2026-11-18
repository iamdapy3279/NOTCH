import Foundation
import AppKit

let imagePath = "WEBSITE DESIGN /ref_homepage_desktop.png"
let outDir = "public/assets/homepage2"
let fileManager = FileManager.default
try? fileManager.createDirectory(atPath: outDir, withIntermediateDirectories: true, attributes: nil)

guard let data = try? Data(contentsOf: URL(fileURLWithPath: imagePath)),
      let rep = NSBitmapImageRep(data: data) else {
    print("Failed to load rep")
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

// Header Logo
// Let's locate the Pulpcraft logo at top left (around x: 300, y: 50)
crop(name: "logo_header", x: 300, y: 40, width: 360, height: 75)
crop(name: "logo_footer", x: 370, y: 15770, width: 380, height: 80)

// Hero Social Proof Avatars
crop(name: "hero_avatars", x: 1475, y: 645, width: 130, height: 60)

// Hero 10 Mosaic Images:
// In section 0: y spans ~840 to ~1800
// Col 1: x: 308, width: 540
//   img 1 (top): y: 848, height: 480
//   img 2 (bottom): y: 1358, height: 440
crop(name: "hero_mosaic_1", x: 308, y: 848, width: 540, height: 480)
crop(name: "hero_mosaic_2", x: 308, y: 1358, width: 540, height: 440)

// Col 2: x: 874, width: 540
//   img 3 (top): y: 974, height: 476
//   img 4 (bottom): y: 1476, height: 320
crop(name: "hero_mosaic_3", x: 874, y: 974, width: 540, height: 476)
crop(name: "hero_mosaic_4", x: 874, y: 1476, width: 540, height: 320)

// Col 3: x: 1440, width: 540
//   img 5 (top): y: 1080, height: 480
//   img 6 (bottom): y: 1586, height: 212
crop(name: "hero_mosaic_5", x: 1440, y: 1080, width: 540, height: 480)
crop(name: "hero_mosaic_6", x: 1440, y: 1586, width: 540, height: 212)

// Col 4: x: 2006, width: 540
//   img 7 (top): y: 974, height: 476
//   img 8 (bottom): y: 1476, height: 320
crop(name: "hero_mosaic_7", x: 2006, y: 974, width: 540, height: 476)
crop(name: "hero_mosaic_8", x: 2006, y: 1476, width: 540, height: 320)

// Col 5: x: 2572, width: 540
//   img 9 (top): y: 848, height: 480
//   img 10 (bottom): y: 1358, height: 440
crop(name: "hero_mosaic_9", x: 2572, y: 848, width: 540, height: 480)
crop(name: "hero_mosaic_10", x: 2572, y: 1358, width: 540, height: 440)

// Section 1: Our Products at a Glance (3 cards)
// y in original: ~2540 to 3260
// Card 1: x: 308, y: 2548, width: 896, height: 712
// Card 2: x: 1262, y: 2548, width: 896, height: 712
// Card 3: x: 2216, y: 2548, width: 896, height: 712
crop(name: "glance_plates_bowls", x: 308, y: 2548, width: 896, height: 712, scale: 0.75)
crop(name: "glance_meal_trays", x: 1262, y: 2548, width: 896, height: 712, scale: 0.75)
crop(name: "glance_compartment_plates", x: 2216, y: 2548, width: 896, height: 712, scale: 0.75)

// Section 2: Facility
// y: ~3900 to 5520, x: 308, width: 2804, height: 1620
crop(name: "facility_full", x: 308, y: 3900, width: 2804, height: 1620, scale: 0.75)
// Also crop just the photo inside without the text overlay if we want crisp text
crop(name: "facility_bg", x: 308, y: 3900, width: 2804, height: 1620, scale: 0.75)

// Section 3: Who are we?
// 3 images on right side:
// x: ~1740 to 3040, y: ~5860 to 7060
// Top left: x: 1736, y: 5860, width: 400, height: 400
// Bottom left: x: 1736, y: 6300, width: 400, height: 500
// Right tall: x: 2176, y: 5860, width: 856, height: 940
crop(name: "who_hands_team", x: 1736, y: 5860, width: 400, height: 400)
crop(name: "who_sugarcane", x: 1736, y: 6300, width: 400, height: 500)
crop(name: "who_moss_hands", x: 2176, y: 5860, width: 856, height: 940, scale: 0.75)

// Section 4: Why Our Tableware Works (5 cards)
// Row 1 (3 cards):
// Card 1: x: 808, y: 7420, width: 580, height: 536
// Card 2: x: 1420, y: 7420, width: 580, height: 536
// Card 3: x: 2032, y: 7420, width: 580, height: 536
// Row 2 (2 wider cards):
// Card 4: x: 808, y: 8000, width: 886, height: 536
// Card 5: x: 1726, y: 8000, width: 886, height: 536
crop(name: "works_card_1_food_safe", x: 808, y: 7420, width: 580, height: 536)
crop(name: "works_card_2_plastic_free", x: 1420, y: 7420, width: 580, height: 536)
crop(name: "works_card_3_compostable", x: 2032, y: 7420, width: 580, height: 536)
crop(name: "works_card_4_microwave", x: 808, y: 8000, width: 886, height: 536)
crop(name: "works_card_5_reused", x: 1726, y: 8000, width: 886, height: 536)

// Section 5: Bestsellers (4 cards)
// Row 1:
// Card 1: x: 308, y: 9240, width: 1362, height: 750
// Card 2: x: 1750, y: 9240, width: 1362, height: 750
// Row 2:
// Card 3: x: 308, y: 10240, width: 1362, height: 750
// Card 4: x: 1750, y: 10240, width: 1362, height: 750
crop(name: "bestseller_plates", x: 308, y: 9240, width: 1362, height: 750, scale: 0.75)
crop(name: "bestseller_bowls", x: 1750, y: 9240, width: 1362, height: 750, scale: 0.75)
crop(name: "bestseller_trays", x: 308, y: 10240, width: 1362, height: 750, scale: 0.75)
crop(name: "bestseller_compartment", x: 1750, y: 10240, width: 1362, height: 750, scale: 0.75)

// Section 7: Certifications (8 logos)
// In section 7:
// Row 1 (4 logos):
crop(name: "cert_brcgs", x: 1056, y: 13210, width: 270, height: 210)
crop(name: "cert_sedex", x: 1406, y: 13210, width: 260, height: 210)
crop(name: "cert_sgs", x: 1750, y: 13210, width: 260, height: 210)
crop(name: "cert_cipet", x: 2090, y: 13210, width: 260, height: 210)
// Row 2 (4 ISO logos):
crop(name: "cert_iso_9001", x: 1056, y: 13530, width: 270, height: 240)
crop(name: "cert_iso_14001", x: 1406, y: 13530, width: 260, height: 240)
crop(name: "cert_iso_45001", x: 1750, y: 13530, width: 260, height: 240)
crop(name: "cert_iso_22000", x: 2090, y: 13530, width: 260, height: 240)
