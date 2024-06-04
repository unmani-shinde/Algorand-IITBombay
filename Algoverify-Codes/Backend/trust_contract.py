from pyteal import *

def approval_program():
    # Define the storage for university mappings
    university_db = Bytes("university_db")

    # Define the storage for the whitelist
    whitelisted_wallets = Bytes("whitelisted_wallets")

    # Define a function to check if the sender is whitelisted
    is_whitelisted = App.localGet(Int(0), whitelisted_wallets).has_value(Txn.sender())

    # Define the createUniversityDatabase function
    university_name = Txn.application_args[1]
    db_hash = Txn.application_args[2]

    on_create = Seq([
        App.globalPut(university_name, db_hash),
        Return(Int(1))
    ])

    on_update = Seq([
        Assert(is_whitelisted),
        App.globalPut(university_name, db_hash),
        Return(Int(1))
    ])

    # Define the router for the application calls
    program = Cond(
        [Txn.application_id() == Int(0), on_create],
        [Txn.application_id() != Int(0), on_update]
    )

    return program

def clear_state_program():
    return Return(Int(1))

if __name__ == "__main__":
    # Compile and output the teal code
    compiled_approval = compileTeal(approval_program(), mode=Mode.Application, version=2)
    compiled_clear = compileTeal(clear_state_program(), mode=Mode.Application, version=2)

    with open("university_db_approval.teal", "w") as f:
        f.write(compiled_approval)

    with open("university_db_clear.teal", "w") as f:
        f.write(compiled_clear)
