import { TestBed, async, inject } from '@angular/core/testing';

import { MachineryGuard } from './machinery.guard';

describe('MachineryGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MachineryGuard]
    });
  });

  it('should ...', inject([MachineryGuard], (guard: MachineryGuard) => {
    expect(guard).toBeTruthy();
  }));
});
