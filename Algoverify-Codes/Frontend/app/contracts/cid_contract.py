import beaker as bk
import pyteal as pt

class CIDState:
    UCID = bk.GlobalStateValue(pt.TealType.bytes)

app = bk.Application("SCID_app", state = CIDState())

@app.external
def update_UCID(cid: pt.abi.String) -> pt.Expr:
        return app.state.UCID.set(cid.get())

@app.external
def read_cids(*, output: pt.abi.String) -> pt.Expr:
        return output.set(app.state.UCID)

if __name__ == "__main__":
    spec = app.build()
    spec.export("artifacts")
    print("global states:\n", spec.schema)