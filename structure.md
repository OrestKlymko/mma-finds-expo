entity > index.tsx
            [id] > index.tsx
        create > index.tsx

fighter > index.tsx - list of fighters / my-fighers
        > create > index.tsx - create fighter
        > [id] > index.tsx - get single fighter (fighter detail view)
               > offer > index.tsx - add offer to fighter
        > featured > index.tsx - get featured fighter    


manager > index.tsx - list if managers
        > create > index.tsx - create manager
        > [id] > index.tsx - manager profile        
        -- manager calls fighter/create, where managerId is passed as param and it automatically connects to manager.


