macro fa {
  rule {
    { $e:expr ; }
  } => {
    ( $e )
  }
  rule {
    { var $a:ident = $e:expr ; $es ... }
  } => {
    ( $e ) . bind ( function ( $a ) { return fa { $es ... } ; } )
  }
  rule {
    { $e:expr ; $es ... }
  } => { 
    ( $e ) . bind ( function () { return fa { $es ... } ;  } ) 
  }
}

export fa;