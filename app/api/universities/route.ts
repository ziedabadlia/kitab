import { NextRequest, NextResponse } from "next/server";

const FALLBACK_UNIVERSITIES = [
  "University of Algiers 1 (Benyoucef Benkhedda)",
  "University of Algiers 2 (Abou El Kacem Saadallah)",
  "University of Algiers 3 (Hassiba Ben Bouali)",
  "University of Science and Technology Houari Boumediene (USTHB)",
  "University of Oran 1 Ahmed Ben Bella",
  "University of Oran 2 Mohamed Ben Ahmed",
  "University of Constantine 1 (Frères Mentouri)",
  "University of Constantine 2 (Abdelhamid Mehri)",
  "University of Constantine 3 (Salah Boubnider)",
  "University of Annaba (Badji Mokhtar)",
  "University of Sétif 1 (Ferhat Abbas)",
  "University of Sétif 2 (Mohamed Lamine Debaghine)",
  "University of Tlemcen (Abou Bekr Belkaid)",
  "University of Béjaïa (Abderrahmane Mira)",
  "University of Batna 1 (Hadj Lakhdar)",
  "University of Batna 2 (Mostefa Ben Boulaïd)",
  "University of Blida 1 (Saad Dahlab)",
  "University of Blida 2 (Lounici Ali)",
  "University of Jijel (Mohammed Seddik Ben Yahia)",
  "University of Tizi Ouzou (Mouloud Mammeri)",
  "University of Médéa (Yahia Fares)",
  "University of Skikda (20 Août 1955)",
  "University of Biskra (Mohamed Khider)",
  "University of Chlef (Hassiba Benbouali)",
  "University of Mostaganem (Abdelhamid Ibn Badis)",
  "University of Msila (Mohamed Boudiaf)",
  "University of Guelma (8 Mai 1945)",
  "University of Souk Ahras (Mohamed Chérif Messaadia)",
  "University of Bouira (Akli Mohand Oulhadj)",
  "University of Bordj Bou Arreridj",
  "University of Khenchela (Abbas Laghrour)",
  "University of Tissemsilt",
  "University of El Oued (Hamma Lakhdar)",
  "University of Ouargla (Kasdi Merbah)",
  "University of Ghardaïa",
  "University of Laghouat (Amar Telidji)",
  "University of Saida (Dr. Moulay Tahar)",
  "University of Tiaret (Ibn Khaldoun)",
  "University of Djelfa (Ziane Achour)",
  "University of Tébessa (Larbi Tébessi)",
  "University of Naâma",
  "University of Ain Témouchent (Belhadj Bouchaib)",
  "University of Relizane (Ahmed Zabana)",
  "University of Tipaza",
  "University of Boumerdès (M'Hamed Bougara)",
  "École Nationale Polytechnique (ENP)",
  "École Nationale Supérieure d'Informatique (ESI)",
  "École Nationale Supérieure des Mines et de la Métallurgie",
  "École Normale Supérieure de Kouba",
  "École Supérieure de Commerce (ESC Alger)",
];

export async function GET(req: NextRequest) {
  const search = req.nextUrl.searchParams.get("name") ?? "";

  try {
    const res = await fetch(
      `http://universities.hipolabs.com/search?name=${encodeURIComponent(search)}`,
      { cache: "no-store" },
    );

    if (!res.ok) throw new Error("upstream error");

    const data = await res.json();
    const universities = data.map((u: { name: string }, i: number) => ({
      id: `${i}-${u.name}`,
      name: u.name,
    }));

    return NextResponse.json(universities);
  } catch {
    // Hipolabs is down — fall back to local list
    const filtered = FALLBACK_UNIVERSITIES.filter((name) =>
      name.toLowerCase().includes(search.toLowerCase()),
    ).map((name, i) => ({ id: `fallback-${i}`, name }));

    return NextResponse.json(filtered);
  }
}
