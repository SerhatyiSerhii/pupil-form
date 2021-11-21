import { Injectable } from "@angular/core";
import { Observable, of } from "rxjs";
import { PupilItem } from "../models/pupil-item";

@Injectable({
    providedIn: 'root'
})
export class PupilsService {
    private pupils: PupilItem[] = [
        new PupilItem('John', 14, true, ['boxing'], 1, 2, new Date(2020, 0, 25)),
        new PupilItem('Alice', 12, true, ['figure skating', 'dancing'], 1, 4, new Date(2020, 1, 1)),
        new PupilItem('Kate', 17, false, [], 1, 1, new Date(2020, 5, 15))
    ];

    public getAllPupils(): Observable<PupilItem[]> {
        return of(this.pupils);
    }

    public getPupilById(id: number): Observable<PupilItem> {
        return of(this.pupils.find((pupil) => {
            return pupil.id === id;
        }));
    }

    public updateContact(id: number, newContact: PupilItem): Observable<PupilItem> {

        const pupil = this.pupils.find((pupil) => pupil.id === id);

        pupil.name = newContact.name;
        pupil.age = newContact.age;
        pupil.hasSportAchievments = newContact.hasSportAchievments;
        pupil.sportGroupsAcheivements = newContact.sportGroupsAcheivements;
        pupil.minSportGroup = newContact.minSportGroup;
        pupil.maxSportGroup = newContact.maxSportGroup;
        pupil.registrationDate = newContact.registrationDate;

        return of(pupil);
    }
}