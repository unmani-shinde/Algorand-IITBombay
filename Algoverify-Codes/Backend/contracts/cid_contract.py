import beaker as bk
import pyteal as pt
import os
from dotenv import load_dotenv

load_dotenv()

class CIDState:
    UCID = bk.GlobalStateValue(pt.TealType.bytes)

app = bk.Application("SCID_app", state = CIDState())

ADMIN_ADDRESS = os.getenv("NEXT_PUBLIC_ALGO_ADDR")

@app.external
def update_UCID(cid: pt.abi.String) -> pt.Expr:
    # Check if the sender is the admin
    is_admin = pt.Txn.sender() == pt.Addr(ADMIN_ADDRESS)
    
    return pt.Seq(
         pt.Assert(is_admin),  # Ensure the sender is the admin
         app.state.UCID.set(cid.get())
         )

@app.external
def read_cids(*, output: pt.abi.String) -> pt.Expr:
        return output.set(app.state.UCID)

if __name__ == "__main__":
    spec = app.build()
    spec.export("artifacts")
    print("global states:\n", spec.schema)