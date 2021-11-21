import { Component, OnInit } from "@angular/core";
import { FormArray, FormControl, FormGroup, Validators } from "@angular/forms";
import { PupilItem } from "../models/pupil-item";
import { PupilsService } from "../services/pupils.service";
import {NgbDateStruct} from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'app-pupil-form',
    templateUrl: './pupil-form.component.html',
    styleUrls: ['./pupil-form.component.scss']
})
export class PupilFormComponent implements OnInit {
    public model: NgbDateStruct;
    public listOfPupils: PupilItem[];
    public pupilForm: FormGroup;
    public hasSportAchievements: boolean = false;
    public savedPupil: PupilItem;

    constructor(private pupilService: PupilsService) { }

    public ngOnInit(): void {
        this.pupilService.getAllPupils().subscribe((data) => {
            this.listOfPupils = data;
        });

        this.pupilForm = new FormGroup({
            name: new FormControl('', Validators.required),
            age: new FormControl('', Validators.required),
            minSportGroup: new FormControl('', Validators.required),
            maxSportGroup: new FormControl('', Validators.required),
            registrationDate: new FormControl('', Validators.required)
        });
    }

    public getSportAchievements(): FormArray {

        if ('sportAchievements' in this.pupilForm.controls) {
            return this.pupilForm.get('sportAchievements') as FormArray;
        } else {
            this.pupilForm.addControl('sportAchievements', new FormArray([]));

            const sportAchievements = this.pupilForm.get('sportAchievements') as FormArray;

            while (sportAchievements.length < 3) {
                sportAchievements.push(new FormControl('', Validators.required));
            }

            return sportAchievements;
        }
    }

    public onClick(id: number): void {
        this.resetFormGroup();

        this.pupilService.getPupilById(id).subscribe((data: PupilItem) => {
            this.savedPupil = data;

            this.setFormFields(data);

            this.model = {year: data.registrationDate.getFullYear(), month: data.registrationDate.getMonth() + 1, day: data.registrationDate.getDate()}

            this.hasSportAchievements = data.hasSportAchievments;

            this.setSportAchievements(data);
        });
    }

    public addDiscipline(): void {
        const sportAchievements = this.pupilForm.get('sportAchievements') as FormArray;

        sportAchievements.push(new FormControl('', Validators.required));
    }

    public deleteDiscipline(index: number): void {
        const sportAchievements = this.pupilForm.get('sportAchievements') as FormArray;

        sportAchievements.removeAt(index);

        if (!sportAchievements.length) {
            this.hasSportAchievements = !this.hasSportAchievements;
        }
    }

    public activateAchievements(): void {
        this.hasSportAchievements = !this.hasSportAchievements;

        if (this.hasSportAchievements === true) {
            this.setSportAchievements(this.savedPupil);

            if (!this.savedPupil.hasSportAchievments) {
                const sportAchievements = this.pupilForm.get('sportAchievements') as FormArray;

                while (sportAchievements.length < 3) {
                    sportAchievements.push(new FormControl('', Validators.required));
                }
            }
        }

        if (this.hasSportAchievements === false && 'sportAchievements' in this.pupilForm.controls) {
            this.pupilForm.removeControl('sportAchievements');
        }
    }

    public updateControlValue(event: any, index: number): void {
        const sportAchievements = this.pupilForm.get('sportAchievements') as FormArray;

        sportAchievements.controls[index].setValue(event.target.value);
    }

    public updateContact(id: number): void {

        const sportAchievements = this.pupilForm.get('sportAchievements') as FormArray;

        const newContact = new PupilItem(
            this.pupilForm.controls.name.value,
            this.pupilForm.controls.age.value,
            this.hasSportAchievements,
            sportAchievements.controls.map((item) => item.value),
            this.pupilForm.controls.minSportGroup.value,
            this.pupilForm.controls.maxSportGroup.value,
            new Date(this.model.year, this.model.month, this.model.day)
        );

        this.pupilService.updateContact(id, newContact);

        this.resetFormGroup();

        this.activateAchievements();

        this.model = undefined;
    }

    private setFormFields(data: PupilItem): void {
        Object.keys(this.pupilForm.controls).forEach((control: string) => {

            let key = control as keyof PupilItem;

            this.pupilForm.get(control).setValue(data[key]);
        })
    }

    private resetFormGroup(): void {
        this.pupilForm.reset();

        this.pupilForm = new FormGroup({
            name: new FormControl('', Validators.required),
            age: new FormControl('', Validators.required),
            minSportGroup: new FormControl('', Validators.required),
            maxSportGroup: new FormControl('', Validators.required),
            registrationDate: new FormControl('', Validators.required)
        });
    }

    private setSportAchievements(data: PupilItem): void {
        this.pupilForm.addControl('sportAchievements', new FormArray([]));

        const achievements = this.pupilForm.get('sportAchievements') as FormArray;

        data.sportGroupsAcheivements.forEach((item) => {
            achievements.push(new FormControl(item, Validators.required));
        });
    }
}
