export class PupilItem {
    private static idGenerator: number = 1;

    public readonly id: number;
    constructor(
        public name: string, public age: number, public hasSportAchievments: boolean,
        public sportGroupsAcheivements: string[], public minSportGroup: number,
        public maxSportGroup: number, public registrationDate: Date) {

        this.id = PupilItem.idGenerator++;
    }
}