export interface DoughnutData {
    name: string;
    value: number;
    full?: boolean;
}

export interface StylizedCircle {
    name: string;
    biophysicalTransgressed: number;
    socialAchieved: number;
}

export interface Quadrant {
    name?: string;
    impact: string;
    dev: string;
}

export const ecologicalData: DoughnutData[] = [
    {name: "climate change", value: 0.01, full: true},
    {name: "ocean acidification", value: 0.02},
    {name: "chemical pollution", value: 0.03},
    {name: "nitrogen & phosphorus", value: 0.01},
    {name: "freshwater withdrawals", value: 0.01, full: true},
    {name: "land conversion", value: 0.01},
    {name: "biodiversity loss", value: 0.01, full: true},
    {name: "air pollution", value: 0.01},
    {name: "ozone layer depletion", value: 0.01},
]
export const socialShortfallData: DoughnutData[] = [
    {name: "water", value: 0.03},
    {name: "food", value: 0.04},
    {name: "health", value: 0.05},
    {name: "education", value: 0.06},
    {name: "income & work", value: 0.06},
    {name: "peace & justice", value: 0.04},
    {name: "political voice", value: 0.05},
    {name: "social equity", value: 0.05},
    {name: "gender equality", value: 0.05},
    {name: "housing", value: 0.06},
    {name: "networks", value: 0.010},
    { name: "energy", value: 0.016 },
];

export const stylizedCircles: StylizedCircle[] = [
    {
        name: 'nmac',
        biophysicalTransgressed: 6,
        socialAchieved: 3
    },
    {
        name: 'eu',
        biophysicalTransgressed: 6,
        socialAchieved: 9
    },
    {
        name: 'uk',
        biophysicalTransgressed: 5,
        socialAchieved: 8
    },
]
export const quadrantData: Quadrant[] = [
    {
        impact: 'Low Impact',
        dev:'High Development',
    },
    {impact: 'High Impact',
    dev: 'High Development'},
    {impact: 'Low Impact', dev:'Low Development'},
    {impact: 'High Impact', dev: 'Low Development'}
];