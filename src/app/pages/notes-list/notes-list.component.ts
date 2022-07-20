import { Component, OnInit } from '@angular/core';
import { Note } from 'src/app/shared/note.model';
import { NotesService } from 'src/app/shared/notes.service';

@Component({
  selector: 'app-notes-list',
  templateUrl: './notes-list.component.html',
  styleUrls: ['./notes-list.component.scss']
})
export class NotesListComponent implements OnInit {

  notes: Note[] = new Array<Note>();
  filteredNotes: Note[] = new Array<Note>();

  constructor(private notesService: NotesService) { }

  ngOnInit(): void {
    this.notes = this.notesService.getAll();
    this.filteredNotes = this.notes;
  }

  deleteNote(id:number){
    this.notesService.delete(id)
  }

  filter(query: string) {
    query = query.toLowerCase().trim();

    let allResults : Note[] = new Array<Note>();

    let terms: string[] = query.split(' ');
    terms = this.removeDuplicate(terms);

    terms.forEach(term => {
      let results: Note[] = this.relevantNotes(term);
      allResults = [...allResults, ...results]
    });

    let uniqueResults =this.removeDuplicate(allResults);
    this.filteredNotes = uniqueResults;

  }

  removeDuplicate(arr: Array<any>) : Array<any> {
    let uniqueResults: Set<any> = new Set<any>();
    
    arr.forEach(e => uniqueResults.add(e));
    return Array.from(uniqueResults);
  }

  relevantNotes(query: string) : Array<Note> {
    query = query.toLowerCase().trim();
    let relevantNotes = this.notes.filter(note => {
      if(note.title && note.title.toLowerCase().includes(query)) {
        return true;
      }
      if(note.body && note.body.toLowerCase().includes(query)) {
        return true;
      }
      return false;
    })

    return relevantNotes;
  }

}
